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
  [ROUTE.IMAGES_LISTING]: {
    params: {
      type: "object",
      properties: {
        targetThreadId: { type: "number" },
        targetMessageId: { type: "number" },
        targetImageOrder: { type: "number" },
      },
      required: ["targetThreadId", "targetMessageId", "targetImageOrder"],
      additionalProperties: false,
    },
  } as const satisfies FastifySchema,
  [ROUTE.IMAGE]: {
    params: {
      type: "object",
      properties: {
        targetThreadId: { type: "number" },
        targetMessageId: { type: "number" },
        targetImageOrder: { type: "number" },
      },
      required: ["targetThreadId", "targetMessageId", "targetImageOrder"],
      additionalProperties: false,
    },
  } as const satisfies FastifySchema,
  [ROUTE.OPEN_IMAGE]: {
    params: {
      type: "object",
      properties: {
        targetThreadId: { type: "number" },
        targetMessageId: { type: "number" },
        targetImageOrder: { type: "number" },
      },
      required: ["targetThreadId", "targetMessageId", "targetImageOrder"],
      additionalProperties: false,
    },
  } as const satisfies FastifySchema,
  [ROUTE.SIDEBAR_ITEM]: {
    params: {
      type: "object",
      properties: {
        targetThreadId: { type: "number" },
      },
      required: ["targetThreadId"],
      additionalProperties: false,
    },
  } as const satisfies FastifySchema,
}
