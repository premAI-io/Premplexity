import { migrate } from "drizzle-orm/postgres-js/migrator"
import DrizzleDB from "$components/DrizzleDB"
import Configs from "$components/Configs"
import { container } from "tsyringe"


void (async () => {
  console.log("Migrating...")

  const drizzleDB = container.resolve<DrizzleDB>(DrizzleDB.token)
  const configs = container.resolve<Configs>(Configs.token)
  const { drizzle } = drizzleDB

  await migrate(drizzle, {
    migrationsFolder: configs.env.DB_MIGRATIONS_PATH,
    migrationsTable: "DrizzleMigrations",
  })

  console.log("Done!")
  process.exit(0)
})()
