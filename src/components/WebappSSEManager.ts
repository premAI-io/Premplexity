import { container, inject, singleton } from "tsyringe"
import {
  createSSEManager,
  SSEManager,
  FastifyHttpAdapter,
  PostgresEventsAdapter
} from "@soluzioni-futura/sse-manager"
import PostgresDB from "./PostgresDB"

@singleton()
export default class WebappSSEManager {
  _init: Promise<void>
  _SSEManager?: SSEManager

  constructor(
    @inject(PostgresDB.token)
    postgresDB: PostgresDB
  ) {
    this._init = new Promise((resolve, reject) => {
      if (this._SSEManager) {
        resolve()
        return
      }

      createSSEManager({
        eventsAdapter: new PostgresEventsAdapter(postgresDB.sql),
        httpAdapter: new FastifyHttpAdapter()
      })
        .then(data => {
          this._SSEManager = data
          resolve()
        })
        .catch(reject)
    })
  }

  get SSEManager(): SSEManager {
    if (!this._SSEManager) {
      throw new Error("SSEManager not initialized yet")
    }

    return this._SSEManager
  }

  init = () => {
    return this._init
  }

  static token = Symbol("WebappSSEManager")
}

container.registerSingleton(WebappSSEManager.token, WebappSSEManager)
