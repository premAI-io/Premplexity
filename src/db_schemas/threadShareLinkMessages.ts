import {
  pgTable,
  serial,
  integer
} from "drizzle-orm/pg-core"
import { threadMessages } from "./threadMessages"
import { threadShareLinks } from "$db_schemas/threadShareLinks"

export const threadShareLinkMessages = pgTable(
  "ThreadShareLinkMessages",
  {
    id: serial("id").primaryKey(),
    threadMessageId: integer("threadMessageId").references(() => threadMessages.id).notNull(),
    threadShareLinkId: integer("threadShareLinkId").references(() => threadShareLinks.id).notNull(),
  }
)

export type ThreadShareLinkMessage = typeof threadShareLinkMessages.$inferSelect
export type NewThreadShareLinkMessage = typeof threadShareLinkMessages.$inferInsert
