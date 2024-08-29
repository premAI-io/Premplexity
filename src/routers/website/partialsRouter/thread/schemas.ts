import { FastifySchema } from "fastify"
import { ROUTE } from "./types"

export const schemas = {
  [ROUTE.DELETE_MODAL]: {
    params: {
      type: "object",
      properties: {
        targetThreadId: { type: "number" },
      },
      required: ["targetThreadId"],
      additionalProperties: false,
    },
  } as const satisfies FastifySchema,
  [ROUTE.SOURCES_MODAL]: {
    params: {
      type: "object",
      properties: {
        targetThreadId: { type: "number" },
        targetMessageId: { type: "number" },
      },
      required: ["targetThreadId", "targetMessageId"],
      additionalProperties: false,
    },
  } as const satisfies FastifySchema,
}
