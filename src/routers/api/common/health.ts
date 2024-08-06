import type { RegisterRoutes } from "$types/index"
import { FastifySchema } from "fastify"

const schema = {
  summary: "Health Check",
  description: "This endpoint checks the health status of the application to ensure it is running and responsive.",
  tags: ["api"],
  response: {
    200: {
      type: "string"
    }
  },
} as const satisfies FastifySchema

const route: RegisterRoutes = (server) => {
  server.route({
    method: "GET",
    url: "/health",
    schema,
    handler: async (req, reply) => {
      return reply.send("ok")
    }
  })
}

export default route
