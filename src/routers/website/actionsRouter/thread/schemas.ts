import { FastifySchema } from "fastify"
import { ROUTE } from "./types"

export const schemas = {
  [ROUTE.CREATE]: {
    body: {
      type: "object",
      properties: {
        model: { type: "string" },
        source: { type: "string" },
        message: { type: "string" }
      },
      required: ["model", "source", "message"],
      additionalProperties: true
    }
  } as const satisfies FastifySchema,
  [ROUTE.DELETE]: {
    params: {
      type: "object",
      properties: {
        id: { type: "number" }
      },
      required: ["id"],
      additionalProperties: false
    }
  } as const satisfies FastifySchema
}
