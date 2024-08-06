import { container, singleton } from "tsyringe"
import {
  createSSEManager,
  SSEManager,
  FastifyHttpAdapter,
  EmitterEventsAdapter
} from "@soluzioni-futura/sse-manager"

@singleton()
export default class WebappSSEManager {
  _init: Promise<void>
  _SSEManager?: SSEManager

  constructor() {
    this._init = new Promise((resolve, reject) => {
      if (this._SSEManager) {
        resolve()
        return
      }

      createSSEManager({
        eventsAdapter: new EmitterEventsAdapter(),
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

  static getUserRoomId = (userId: number | string): string => `U-${userId}`
  static getGlobalRoomId = (): string => "ALL"

  static token = Symbol("WebappSSEManager")
}

container.registerSingleton(WebappSSEManager.token, WebappSSEManager)
