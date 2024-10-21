import type { RegisterRoutes } from "$types/index"
import { FastifySchema } from "fastify"
import { JSONSchema7 } from "json-schema"

const response200 = {
  type: "string"
} as const satisfies JSONSchema7

const schema = {
  hide: true,
  tags: ["api"],
  response: {
    200: response200
  }
} as const satisfies FastifySchema

const route: RegisterRoutes = (server) => {
  server.route({
    method: "GET",
    url: "/schema",
    schema,
    handler: async (request, reply) => {
      return reply.send(JSON.stringify(server.swagger()))
    }
  })

}

export default route
