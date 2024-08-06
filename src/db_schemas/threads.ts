import { users } from "$db_schemas/users"
import {
  pgTable,
  serial,
  timestamp,
  integer,
  varchar,
  boolean
} from "drizzle-orm/pg-core"

export const threads = pgTable(
  "Threads",
  {
    id: serial("id").primaryKey(),
    creationTimestamp: timestamp("creationTimestamp", { withTimezone: true, mode: "string" }).defaultNow(),
    userId: integer("userId").references(() => users.id).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    deleted: boolean("deleted").default(false)
  }
)

export type Thread = typeof threads.$inferSelect
export type NewThread = typeof threads.$inferInsert
