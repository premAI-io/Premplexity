import BaseService from "$services/BaseService"
import {
  ThreadShareLinkMessage,
  threadShareLinkMessages as threadShareLinkMessagesTable,
} from "$db_schemas/threadShareLinkMessages"
import DrizzleDB from "$components/DrizzleDB"
import Configs from "$components/Configs"
import { inject, container, injectable } from "tsyringe"

export type ThreadShareLinkMessageComplete = ThreadShareLinkMessage

@injectable()
export default class ThreadShareLinkMessagesService extends BaseService<
  typeof threadShareLinkMessagesTable,
  ThreadShareLinkMessageComplete,
  number
> {
  mainTable = threadShareLinkMessagesTable
  pk = threadShareLinkMessagesTable.id
  baseOrderBy = [this.mainTable.id]

  constructor(
    @inject(DrizzleDB.token)
    private drizzleDB: DrizzleDB,
    @inject(Configs.token)
    private configs: Configs
  ) {
    super(drizzleDB)
  }

  insert = this._insert

  static token = Symbol("ThreadShareLinkMessagesService")
}

container.register(ThreadShareLinkMessagesService.token, ThreadShareLinkMessagesService)
