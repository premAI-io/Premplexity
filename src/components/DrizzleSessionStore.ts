import { Session } from "fastify"
import { SessionStore } from "@fastify/session"
import { container, inject, injectable } from "tsyringe"
import DrizzleDB, { DrizzleWithSchemas } from "./DrizzleDB"
import * as sessionsSchemas from "$db_schemas/sessions"
import { eq, inArray } from "drizzle-orm"
import PostgresDB from "./PostgresDB"

@injectable()
export default class DrizzleSessionStore {
  db: DrizzleWithSchemas

  constructor(
    @inject(PostgresDB.token)
    private postgresDB: PostgresDB,
  ) {
    const drizzleDB = new DrizzleDB(postgresDB)

    this.db = drizzleDB.drizzle
  }

  _getSession: (sid: string) => Promise<Session | undefined> = async (sid) => {
    const res = await this.db
      .select()
      .from(sessionsSchemas.sessions)
      .where(eq(sessionsSchemas.sessions.sid, sid))

    let session: Session | undefined = undefined

    if (res.length > 0) {
      session = {
        ...res[0].data,
        cookie: res[0].cookie
      }
    }

    return session
  }

  store: SessionStore = {
    destroy: (sid, callback) => {
      this.db
        .delete(sessionsSchemas.sessions)
        .where(eq(sessionsSchemas.sessions.sid, sid))
        .then(() => callback(null))
        .catch(err => callback(err))
    },

    get: (sid, callback) => {
      this
        ._getSession(sid)
        .then(session => callback(null, session))
        .catch(err => callback(err))
    },

    set: (sid, session, callback) => {
      const {
        cookie,
        ...data
      } = session

      const expires = cookie.expires!.toISOString()
      const callerUserId = data.data.callerUserId

      this.db
        .insert(sessionsSchemas.sessions)
        .values({
          sid,
          data,
          cookie,
          expires,
          callerUserId
        })
        .onConflictDoUpdate({
          set: {
            data,
            cookie,
            expires,
            callerUserId
          },
          target: sessionsSchemas.sessions.sid
        })
        .then(() => callback(null))
        .catch(err => callback(err))
    }
  }

  dropSession = async (sid: string) => {
    await this.db
      .delete(sessionsSchemas.sessions)
      .where(eq(sessionsSchemas.sessions.sid, sid))
  }

  dropUsersSessions = async (ids: number | number[]) => {
    const userIds = Array.isArray(ids) ? ids : [ids]

    if (userIds.length === 0) {
      return
    }

    await this.db
      .delete(sessionsSchemas.sessions)
      .where(
        inArray(sessionsSchemas.sessions.callerUserId, userIds)
      )
  }

  static token = Symbol("DrizzleSessionStore")
}

container.register(DrizzleSessionStore.token, DrizzleSessionStore)
