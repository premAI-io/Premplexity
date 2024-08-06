import Postgres from "postgres"
import { container, inject, singleton } from "tsyringe"
import Configs from "$components/Configs"

@singleton()
export default class PostgresDB {
  sql: Postgres.Sql

  constructor(
    @inject(Configs.token)
    configs: Configs
  ) {
    this.sql = Postgres({
      host: configs.env.POSTGRES_HOST,
      port: configs.env.POSTGRES_PORT,
      database: configs.env.POSTGRES_DB,
      username: configs.env.POSTGRES_USER,
      password: configs.env.POSTGRES_PASSWORD,
      ...configs.env.ENVIRONMENT !== "local" ? {
        ssl: {
          rejectUnauthorized: false
        },
      } : {},
      transform: {
        value: (value) => {
          if (value instanceof Date) {
            return value.toISOString()
          }

          return value
        }
      },
      idle_timeout: configs.env.POSTGRES_IDLE_TIMEOUT
    })
  }


  static token = Symbol("PostgresDB")
}

container.registerSingleton(PostgresDB.token, PostgresDB)
