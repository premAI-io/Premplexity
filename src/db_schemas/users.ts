import {
  pgTable,
  serial,
  timestamp,
  integer
} from "drizzle-orm/pg-core"

export const users = pgTable(
  "Users",
  {
    id: serial("id").primaryKey(),
    creationTimestamp: timestamp("creationTimestamp", { withTimezone: true, mode: "string" }).defaultNow()
  }
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
