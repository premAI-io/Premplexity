import { FastifyPluginCallback } from "fastify"
import { registerActionsRouter } from "../utils"
import { threadRouter, threadRouterPrefix } from "$routers/website/actionsRouter/thread/index"
import { userRouter, userRouterPrefix } from "$routers/website/actionsRouter/user/index"

const router: FastifyPluginCallback = (server, _, done) => {
  registerActionsRouter(server, threadRouter, threadRouterPrefix)
  registerActionsRouter(server, userRouter, userRouterPrefix)

  return done()
}

export default router
