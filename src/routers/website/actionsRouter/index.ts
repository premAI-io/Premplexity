import { FastifyPluginCallback } from "fastify"
import { registerActionsRouter } from "../utils"
import { threadRouter, threadRouterPrefix } from "$routers/website/actionsRouter/thread/index"
import { userRouter, userRouterPrefix } from "$routers/website/actionsRouter/user/index"
import { snapshotRouter, snapshotRouterPrefix } from "$routers/website/actionsRouter/snapshot/index"

const router: FastifyPluginCallback = (server, _, done) => {
  registerActionsRouter(server, threadRouter, threadRouterPrefix)
  registerActionsRouter(server, userRouter, userRouterPrefix)
  registerActionsRouter(server, snapshotRouter, snapshotRouterPrefix)

  return done()
}

export default router
