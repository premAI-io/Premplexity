import { threads } from "$db_schemas/threads"
import {
  pgTable,
  serial,
  timestamp,
  integer,
  varchar
} from "drizzle-orm/pg-core"

export const threadShareLinks = pgTable(
  "ThreadShareLinks",
  {
    id: serial("id").primaryKey(),
    creationTimestamp: timestamp("creationTimestamp", { withTimezone: true, mode: "string" }).defaultNow(),
    threadId: integer("threadId").references(() => threads.id).notNull(),
    code: varchar("code", { length: 255 }).notNull(),
  }
)

export type ThreadShareLink = typeof threadShareLinks.$inferSelect
export type NewThreadShareLink = typeof threadShareLinks.$inferInsert
