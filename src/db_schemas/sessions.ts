import { Session } from "fastify"

import {
  pgTable,
  varchar,
  json,
  timestamp,
  integer
} from "drizzle-orm/pg-core"
import { users } from "./users"

export const sessions = pgTable(
  "Sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    data: json("data").$type<Omit<Session, "cookie">>().notNull(),
    cookie: json("cookie").$type<Session["cookie"]>().notNull(),
    expires: timestamp("expires", { withTimezone: true, mode: "string" }).notNull(),
    callerUserId: integer("callerUserId").references(() => users.id)
  }
)
