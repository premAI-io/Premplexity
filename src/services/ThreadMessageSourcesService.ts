import BaseService from "$services/BaseService"
import {
  ThreadMessageSource,
  NewThreadMessageSource,
  threadMessageSources as threadMessageSourcesTable,
} from "$db_schemas/threadMessageSources"
import DrizzleDB from "$components/DrizzleDB"
import { inject, container, injectable } from "tsyringe"
import SOURCE_TYPE from "$types/SOURCE_TYPE"

export type ThreadMessageSourcesServiceComplete = ThreadMessageSource & ({
  type: SOURCE_TYPE.WEB_PAGE,
  title: string,
  link: string,
  snippet: string,
  favicon: string
})

export type InsertThreadMessageSource = NewThreadMessageSource & ({
  type: SOURCE_TYPE.WEB_PAGE,
  title: string,
  link: string,
  snippet: string,
  favicon: string
})

@injectable()
export default class ThreadMessageSourcesService extends BaseService<
  typeof threadMessageSourcesTable,
  ThreadMessageSourcesServiceComplete,
  number
> {
  mainTable = threadMessageSourcesTable
  pk = threadMessageSourcesTable.id
  baseOrderBy = [this.mainTable.id]

  constructor(
    @inject(DrizzleDB.token)
    private drizzleDB: DrizzleDB
  ) {
    super(drizzleDB)
  }

  insert = (data: InsertThreadMessageSource | InsertThreadMessageSource[]) => this._insert(data)

  static token = Symbol("ThreadMessageSourcesService")
}

container.register(ThreadMessageSourcesService.token, ThreadMessageSourcesService)
