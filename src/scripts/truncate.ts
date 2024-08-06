import DrizzleDB from "$components/DrizzleDB"
import { sql } from "drizzle-orm"
import { container } from "tsyringe"

export const clearDb = async (drizzleDB: DrizzleDB): Promise<void> => {
  const query = drizzleDB.sql<string>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';
  `

  const tables = await drizzleDB.drizzle.execute(query)

  for (const table of tables) {
    process.stdout.write(`Truncating table ${table.table_name}... `)
    const query = sql.raw(`TRUNCATE TABLE "${table.table_name}" RESTART IDENTITY CASCADE;`)
    await drizzleDB.drizzle.execute(query)
    process.stdout.write("OK\n")
  }
}

void (async () => {
  console.log("Truncating...")

  const drizzleDB = container.resolve<DrizzleDB>(DrizzleDB.token)
  await clearDb(drizzleDB)

  console.log("Done!")
  process.exit(0)
})()
