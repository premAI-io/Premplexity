import BaseService from "$services/BaseService"
import {
  ThreadMessageSource,
  NewThreadMessageSource,
  threadMessageSources as threadMessageSourcesTable,
} from "$db_schemas/threadMessageSources"
import DrizzleDB from "$components/DrizzleDB"
import { inject, container, injectable } from "tsyringe"
import SOURCE_TYPE from "$types/SOURCE_TYPE"

export type WebPageThreadMessageSourcesServiceComplete = ThreadMessageSource & {
  type: SOURCE_TYPE.WEB_PAGE,
  title: string,
  link: string,
  snippet: string,
  favicon: string,
  order: number
}

export type ImageThreadMessageSourcesServiceComplete = ThreadMessageSource & {
  type: SOURCE_TYPE.IMAGE,
  thumbnail: string,
  image: string,
  link: string,
  order: number
}

export type ThreadMessageSourcesServiceComplete = (
  WebPageThreadMessageSourcesServiceComplete |
  ImageThreadMessageSourcesServiceComplete
)

export type InsertThreadMessageSource = NewThreadMessageSource & ({
  type: SOURCE_TYPE.WEB_PAGE,
  title: string,
  link: string,
  snippet: string,
  favicon: string,
  order: number
} | {
  type: SOURCE_TYPE.IMAGE,
  thumbnail: string,
  image: string,
  link: string,
  order: number
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

  _specializeByType = (data: ThreadMessageSource[]): ThreadMessageSourcesServiceComplete[] => {
    return data.map((d) => {
      if (d.type === SOURCE_TYPE.WEB_PAGE) {
        return {
          ...d,
          type: SOURCE_TYPE.WEB_PAGE,
          title: d.title!,
          link: d.link!,
          snippet: d.snippet!,
          favicon: d.favicon!,
          order: d.order!
        }
      }

      if (d.type === SOURCE_TYPE.IMAGE) {
        return {
          ...d,
          type: SOURCE_TYPE.IMAGE,
          thumbnail: d.thumbnail!,
          image: d.image!,
          link: d.link!,
          order: d.order!
        }
      }

      throw new Error(`Unknown type ${d.type}`)
    })
  }

  insert = (data: InsertThreadMessageSource | InsertThreadMessageSource[]) => this._insert(data)

  static token = Symbol("ThreadMessageSourcesService")
}

container.register(ThreadMessageSourcesService.token, ThreadMessageSourcesService)
