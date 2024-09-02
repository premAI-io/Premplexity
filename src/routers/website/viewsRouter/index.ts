import { FastifyPluginCallback } from "fastify"
import { registerViewsRouter } from "../utils"
import { router as threadRouter } from "./threadRouter"
import { router as historyRouter } from "./historyRouter"

const router: FastifyPluginCallback = (server, _, done) => {
  registerViewsRouter(server, threadRouter)
  registerViewsRouter(server, historyRouter)

  return done()
}

export default router
