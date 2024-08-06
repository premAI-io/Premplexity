/// <reference types="@kitajs/html/htmx.d.ts" />

import { FastifyPluginCallback } from "fastify"
import { registerViewsRouter } from "$routers/website/utils"
import { threadRouter, threadRouterPrefix } from "$routers/website/partialsRouter/thread/index"


const router: FastifyPluginCallback = (server, _, done) => {
  registerViewsRouter(server, threadRouter, threadRouterPrefix)

  return done()
}

export default router
