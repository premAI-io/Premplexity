import { drizzle } from "drizzle-orm/postgres-js"
import { injectable, container, inject } from "tsyringe"
import PostgresDB from "$components/PostgresDB"
import Postgres from "postgres"
import QueryLogger from "$components/QueryLogger"

import * as usersSchemas from "$db_schemas/users"
import * as sessionsSchemas from "$db_schemas/sessions"
import * as threadMessageSourcesSchemas from "$db_schemas/threadMessageSources"
import * as threadMessagesSchemas from "$db_schemas/threadMessages"
import * as threadShareLinkMessagesSchemas from "$db_schemas/threadShareLinkMessages"
import * as threadShareLinksSchemas from "$db_schemas/threadShareLinks"
import * as threadsSchemas from "$db_schemas/threads"



import { Logger, sql } from "drizzle-orm"

const getDrizzle = (sql: Postgres.Sql, logger?: Logger) => {
  const d = drizzle(sql, {
    logger: logger || new QueryLogger(),
    schema: {
      ...usersSchemas,
      ...sessionsSchemas,
      ...threadMessageSourcesSchemas,
      ...threadMessagesSchemas,
      ...threadShareLinkMessagesSchemas,
      ...threadShareLinksSchemas,
      ...threadsSchemas
    }
  })

  return d
}

export type DrizzleWithSchemas = ReturnType<typeof getDrizzle>

@injectable()
export default class DrizzleDB {
  drizzle: DrizzleWithSchemas
  _postgresSql: Postgres.Sql
  sql: typeof sql
  public logger: QueryLogger

  constructor(
    @inject(PostgresDB.token)
    PostgresDB: PostgresDB,
    logger?: QueryLogger
  ) {
    this.logger = logger || new QueryLogger()
    this._postgresSql = PostgresDB.sql
    this.drizzle = getDrizzle(this._postgresSql, this.logger)
    this.sql = sql
  }

  static getDrizzleDB = () => {
    const postgresDB = container.resolve<PostgresDB>(PostgresDB)
    const drizzleDB = new DrizzleDB(postgresDB)

    return drizzleDB
  }

  static token = Symbol("DrizzleDB")
}

container.register(DrizzleDB.token, DrizzleDB)
