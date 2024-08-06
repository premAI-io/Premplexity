import { FastifyPluginCallback } from "fastify"
import { registerViewsRouter } from "../utils"
import { router as threadRouter } from "./threadRouter"

const router: FastifyPluginCallback = (server, _, done) => {
  registerViewsRouter(server, threadRouter)

  return done()
}

export default router
