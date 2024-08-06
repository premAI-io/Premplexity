import {
  pgTable,
  serial,
  integer,
  varchar,
  pgEnum
} from "drizzle-orm/pg-core"
import { threadMessages } from "./threadMessages"
import SOURCE_TYPE from "$types/SOURCE_TYPE"

export const threadMessageSourceTypeEnum = pgEnum("threadMessageSourceTypeEnum", Object.values(SOURCE_TYPE) as [string, ...string[]])

export const threadMessageSources = pgTable(
  "ThreadMessageSources",
  {
    id: serial("id").primaryKey(),
    threadMessageId: integer("threadMessageId").references(() => threadMessages.id).notNull(),
    type: threadMessageSourceTypeEnum("type").notNull(),
    order: integer("order").notNull(),

    // For WEB_PAGE
    title: varchar("title"),
    link: varchar("link"),
    snippet: varchar("snippet"),
    favicon: varchar("favicon")
  }
)

export type ThreadMessageSource = typeof threadMessageSources.$inferSelect
export type NewThreadMessageSource = typeof threadMessageSources.$inferInsert
