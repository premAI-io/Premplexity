import { FastifySchema } from "fastify"
import { ROUTE } from "./types"

export const schemas = {
  [ROUTE.DELETE_MODAL]: {
    params: {
      type: "object",
      properties: {
        id: { type: "number" },
      },
      required: ["id"],
      additionalProperties: false,
    },
  } as const satisfies FastifySchema,
}
