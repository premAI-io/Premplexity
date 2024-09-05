import { threads } from "$db_schemas/threads"
import {
  pgTable,
  serial,
  timestamp,
  integer,
  text,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core"

export const threadMessages = pgTable("ThreadMessages", {
  id: serial("id").primaryKey(),

  threadId: integer("threadId").references(() => threads.id).notNull(),

  // enum of SOURCE_TYPE
  sourceType: varchar("sourceType", { length: 255 }).notNull(),

  // if sourceType = SOURCE_TYPE.WEB_PAGE
  webSearchEngineType: varchar("webSearchEngineType", { length: 255 }),

  // Order is used to sort the retried messages
  order: serial("order").notNull(),

  // user
  userQuery: text("userQuery").notNull(),
  userImprovedQuery: text("userImprovedQuery"),
  userTimestamp: timestamp("userTimestamp", { withTimezone: true, mode: "string" }).defaultNow().notNull(),

  // assistant
  assistantResponse: text("assistantResponse"),
  assistantError: text("assistantError"),
  assistantTimestamp: timestamp("assistantTimestamp", { withTimezone: true, mode: "string" }),
  assistantModel: varchar("assistantModel", { length: 255 }).notNull(),
  errorData: text("errorData"),

  followUpQuestions: jsonb("followUpQuestions").notNull().$type<string[]>().default([]),
})

export type ThreadMessage = typeof threadMessages.$inferSelect
export type NewThreadMessage = typeof threadMessages.$inferInsert
