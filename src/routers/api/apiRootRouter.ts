import { FastifyPluginCallback } from "fastify"

// common
import health from "./common/health"
import docs from "./common/docs"
import schema from "./common/schema"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Options = { [key: string]: any }

const router: FastifyPluginCallback<Options> = (server, _, done) => {
  const routes = [
    health,
    docs,
    schema
  ]

  // register routes
  routes.forEach((route) => route(server))

  return done()
}

export default router
