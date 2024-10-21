import BaseService from "$services/BaseService"
import { User, users as usersTable } from "$db_schemas/users"
import DrizzleDB from "$components/DrizzleDB"
import Configs from "$components/Configs"
import { inject, container, injectable } from "tsyringe"

export type BaseUser = User
export type CompleteUser = User

@injectable()
export default class UsersService extends BaseService<typeof usersTable, User, number> {
  mainTable = usersTable
  pk = usersTable.id

  constructor(
    @inject(DrizzleDB.token)
    private drizzleDB: DrizzleDB,

    @inject(Configs.token)
    private configs: Configs,
  ) {
    super(drizzleDB)
  }

  createAnonymousUser(): Promise<User> {
    return this._insert({})
  }

  static token = Symbol("UsersService")
}

container.register(UsersService.token, UsersService)
