import { FastifySchema } from "fastify"
import { ROUTE } from "./types"

export const schemas = {
  [ROUTE.OPEN_SSE]: {} as const satisfies FastifySchema,
}
