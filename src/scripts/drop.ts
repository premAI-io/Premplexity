import DrizzleDB from "$components/DrizzleDB"
import { container } from "tsyringe"

export const dropDb = async (drizzleDB: DrizzleDB): Promise<void> => {
  const query = drizzleDB.sql`
    DROP SCHEMA IF EXISTS public CASCADE;
    DROP SCHEMA IF EXISTS drizzle CASCADE;
    CREATE SCHEMA public;
  `

  await drizzleDB.drizzle.execute(query)
}

void (async () => {
  console.log("Dropping...")

  const drizzleDB = container.resolve<DrizzleDB>(DrizzleDB.token)
  await dropDb(drizzleDB)

  console.log("Done!")
  process.exit(0)
})()
