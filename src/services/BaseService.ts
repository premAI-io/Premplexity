/* eslint-disable @typescript-eslint/no-explicit-any */
import DrizzleDB, { DrizzleWithSchemas } from "$components/DrizzleDB"
import { PgColumn, PgTable, PgSelect, PgTransaction, PgDatabase } from "drizzle-orm/pg-core"
import { and, asc, eq, inArray, SelectedFields, SQL } from "drizzle-orm"
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js"
import Postgres from "postgres"

export type CommonTransaction = PgTransaction<PostgresJsQueryResultHKT, any, any>
export type CommonPgDatabase = PgDatabase<PostgresJsQueryResultHKT, any, any>

export type CommonOptions = {
  transaction?: CommonTransaction,
  select?: SelectedFields<PgColumn, PgTable>
  where?: SQL,
  skipBaseWhere?: boolean,
  dynamicQuery?: (
    db: CommonPgDatabase | CommonTransaction
  ) => PgSelect
}

export type BaseQuery = (options?: CommonOptions) => PgSelect
export type ServiceListingFn<T> = (options?: CommonOptions & {
  limit?: number,
  offset?: number,
  orderBy?: (PgColumn | SQL | SQL.Aliased)[]
}) => Promise<T[]>


/*
  T = Table
  E = Entity
*/

export default abstract class BaseSchemaModel<T extends PgTable, E, PK_TYPE = number> {
  drizzle: DrizzleWithSchemas
  _postgreSQL: Postgres.Sql

  abstract mainTable: T
  abstract pk: PgColumn

  constructor(
    drizzleDB: DrizzleDB
  ) {
    this.drizzle = drizzleDB.drizzle
    this._postgreSQL = drizzleDB._postgresSql
  }

  baseWhere?: SQL | (() => SQL) = undefined
  baseSelect?: SelectedFields<PgColumn, T> = undefined
  baseOrderBy?: (PgColumn | SQL | SQL.Aliased)[] = undefined

  get _baseWhere() {
    return typeof this.baseWhere === "function" ? this.baseWhere() : this.baseWhere
  }


  get orderBy() {
    return this.baseOrderBy || [asc(this.pk)]
  }

  _composeWhere = (...where: (SQL | undefined)[]): SQL | undefined => {
    const whereArray = where.filter(e => e !== undefined) as SQL[]
    if (whereArray.length === 0) {
      return undefined
    }

    if (whereArray.length === 1) {
      return whereArray[0]
    } else {
      return and(...whereArray)
    }
  }

  postProcess?: (results: T["$inferSelect"][], options?: CommonOptions) => Promise<E[]> = undefined

  getPkValue = (entity: any): PK_TYPE => {
    return entity[this.pk.name]
  }

  baseQuery: BaseQuery = (options?: CommonOptions) => {
    const {
      transaction,
      select: optionsSelect,
      where: optionsWhere,
      skipBaseWhere = false,
      dynamicQuery
    } = options || {}

    const select = optionsSelect || this.baseSelect
    const whereConstraints: SQL[] = []

    if (!skipBaseWhere && this._baseWhere) {
      whereConstraints.push(this._baseWhere)
    }

    if (optionsWhere) {
      whereConstraints.push(optionsWhere)
    }

    const db = transaction || this.drizzle
    let query

    if (dynamicQuery) {
      query = dynamicQuery(db)
    } else if (select) {
      query = db
        .select(select)
        .from(this.mainTable)
        .$dynamic()
    } else {
      query = db
        .select()
        .from(this.mainTable)
        .$dynamic()
    }

    if (whereConstraints.length) {
      query = query.where(
        this._composeWhere(...whereConstraints)
      )
    }

    return query
  }

  _postProcess = async (rawResults: T["$inferSelect"][], options?: CommonOptions): Promise<E[]> => {
    let results: E[] = []

    if (this.postProcess) {
      if (rawResults.length) {
        results = await this.postProcess(rawResults, options)
      }
    } else {
      results = rawResults as unknown as E[]
    }

    return results
  }

  get = async (pk: PK_TYPE, options?: CommonOptions): Promise<E | null> => {
    const rawResults = await this.baseQuery({
      ...options,
      where: this._composeWhere(eq(this.pk, pk), options?.where)
    })

    const results = await this._postProcess(rawResults, options)

    const [result] = results

    if (!result) {
      return null
    }

    return result
  }

  getOrFail = async (pk: PK_TYPE, options?: CommonOptions): Promise<E> => {
    const result = await this.get(pk, options)

    if (!result) {
      throw new Error(`No ${this.mainTable} found with ${this.pk} ${pk}`)
    }

    return result
  }

  mGet = async (pks: PK_TYPE[], options?: CommonOptions): Promise<E[]> => {
    if (pks.length === 0) {
      return []
    }

    const rawResults = await this.baseQuery({
      ...options,
      where: this._composeWhere(inArray(this.pk, pks), options?.where)
    })

    const fullfilledResults = await this._postProcess(rawResults, options)
    return pks.map(pk => fullfilledResults.find(result => this.getPkValue(result) === pk)!).filter(e => e !== undefined)
  }

  list: ServiceListingFn<E> = async (options) => {
    let queryCall = this.baseQuery(options)

    const listOrderBy = options?.orderBy || []
    const baseOrderBy = this.orderBy || [asc(this.pk)]
    queryCall = queryCall.orderBy(...listOrderBy, ...baseOrderBy)

    if (options?.limit) {
      queryCall = queryCall.limit(options.limit)
    }

    if (options?.offset) {
      queryCall = queryCall.offset(options.offset)
    }

    const rawResults = await queryCall
    const results = await this._postProcess(rawResults)

    return results
  }

  count = async (options?: CommonOptions): Promise<number> => {
    const count = (await this.baseQuery(options)).length
    return count
  }

  mGetPartial = async <T = Partial<E>>(pks: PK_TYPE[], options?: CommonOptions): Promise<T[]> => {
    if (pks.length === 0) {
      return []
    }

    const rawResults = await this.baseQuery({
      ...options,
      where: this._composeWhere(inArray(this.pk, pks), options?.where)
    })

    return pks.map(pk => rawResults.find(result => result[this.pk.name] === pk) as T).filter(e => e !== undefined)
  }

  protected _sInsert = async (data: T["$inferInsert"], options?: CommonOptions): Promise<E> => {
    return this._insert(data, options) as Promise<E>
  }

  protected _insert = async <P extends T["$inferInsert"] | T["$inferInsert"][]>(data: P, options?: CommonOptions): Promise<P extends T["$inferInsert"] ? E : E[]> => {
    const {
      transaction
    } = options || {}

    const db = transaction || this.drizzle
    const dataValues = Array.isArray(data) ? data : [data]

    const results = await db
      .insert(this.mainTable)
      .values(dataValues)
      .returning({ [this.pk.name]: this.pk })

    const pkValues = results.map(r => this.getPkValue(r))
    const returnData = await this.mGet(pkValues, options)

    if (Array.isArray(data)) {
      return returnData as P extends T["$inferInsert"] ? E : E[]
    }

    return returnData[0] as P extends T["$inferInsert"] ? E : E[]
  }

  protected _mInsert = async (data: T["$inferInsert"][], options?: CommonOptions): Promise<E[]> => {
    if (data.length === 0) {
      return []
    }

    return this._insert(data, options) as Promise<E[]>
  }

  update = async (pk: PK_TYPE, data: Partial<T["$inferInsert"]>, options?: CommonOptions) => {
    const {
      transaction
    } = options || {}

    const db = transaction || this.drizzle

    await db
      .update(this.mainTable)
      .set(data)
      .where(eq(this.pk, pk))
  }

  mUpdate = async (data: Partial<T["$inferInsert"]>, whereClause: SQL, options?: CommonOptions) => {
    const {
      transaction
    } = options || {}

    const db = transaction || this.drizzle

    await db
      .update(this.mainTable)
      .set(data)
      .where(whereClause)
  }
}

