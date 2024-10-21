import { FastifySchema } from "fastify"
import { ROUTE } from "./types"

export const schemas = {
  [ROUTE.IMPORT]: {
    params: {
      type: "object",
      properties: {
        targetSnapshotCode: { type: "string" }
      },
      required: ["targetSnapshotCode"],
      additionalProperties: false
    }
  } as const satisfies FastifySchema
}
