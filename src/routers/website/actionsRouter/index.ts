import { FastifyPluginCallback } from "fastify"
import { registerActionsRouter } from "../utils"
import { threadRouter, threadRouterPrefix } from "$routers/website/actionsRouter/thread/index"

const router: FastifyPluginCallback = (server, _, done) => {
  registerActionsRouter(server, threadRouter, threadRouterPrefix)

  return done()
}

export default router
