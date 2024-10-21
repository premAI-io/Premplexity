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

    // for WEB_PAGE and IMAGE
    order: integer("order").notNull(),
    link: varchar("link"),
    title: varchar("title"),

    // For WEB_PAGE
    snippet: varchar("snippet"),
    favicon: varchar("favicon"),

    // For IMAGE
    thumbnail: varchar("thumbnail"),
    image: varchar("image")
  }
)

export type ThreadMessageSource = typeof threadMessageSources.$inferSelect
export type NewThreadMessageSource = typeof threadMessageSources.$inferInsert
