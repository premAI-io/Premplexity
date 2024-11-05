import { FastifySchema } from "fastify"
import { ROUTE } from "./types"

export const schemas = {
  [ROUTE.CREATE]: {
    body: {
      type: "object",
      properties: {
        client: { type: "string", enum: ["PREM"], default: "PREM" },
        model: { type: "string" },
        searchEngine: { type: "string" },
        message: { type: "string" },
        inputPrompt: { type: "string" },
        search: {
          anyOf: [
            { type: "string" },
            { type: "array", items: { type: "string" } }
          ]
        }
      },
      required: ["model", "searchEngine", "inputPrompt"],
      additionalProperties: false
    }
  } as const satisfies FastifySchema,
  [ROUTE.DELETE]: {
    params: {
      type: "object",
      properties: {
        targetThreadId: { type: "number" }
      },
      required: ["targetThreadId"],
      additionalProperties: false
    }
  } as const satisfies FastifySchema,
  [ROUTE.SEND_MESSAGE]: {
    params: {
      type: "object",
      properties: {
        targetThreadId: { type: "number" }
      },
      required: ["targetThreadId"],
      additionalProperties: false
    },
    body: {
      type: "object",
      properties: {
        client: { type: "string", enum: ["PREM"], default: "PREM" },
        model: { type: "string" },
        searchEngine: { type: "string" },
        message: { type: "string" },
        inputPrompt: { type: "string" },
        search: {
          anyOf: [
            { type: "string" },
            { type: "array", items: { type: "string" } }
          ]
        }
      },
      required: ["model", "searchEngine", "inputPrompt"],
      additionalProperties: false
    }
  } as const satisfies FastifySchema,
  [ROUTE.RETRY]: {
    params: {
      type: "object",
      properties: {
        targetThreadId: { type: "number" }
      },
      required: ["targetThreadId"],
      additionalProperties: false
    },
    body: {
      type: "object",
      properties: {
        client: { type: "string", enum: ["PREM"], default: "PREM" },
        model: { type: "string" },
        searchEngine: { type: "string" },
        search: {
          anyOf: [
            { type: "string" },
            { type: "array", items: { type: "string" } }
          ]
        },
        inputPrompt: { type: "string" }
      },
      additionalProperties: false
    }
  } as const satisfies FastifySchema,
  [ROUTE.EDIT_MESSAGE]: {
    params: {
      type: "object",
      properties: {
        targetThreadId: { type: "number" }
      },
      required: ["targetThreadId"],
      additionalProperties: false
    },
    querystring: {
      type: "object",
      properties: {
        message: { type: "string" },
        model: { type: "string" },
        searchEngine: { type: "string" },
        client: { type: "string", enum: ["PREM"], default: "PREM" }
      },
      required: ["message"],
      additionalProperties: true
    },
    body: {
      type: "object",
      additionalProperties: false
    }
  } as const satisfies FastifySchema,
  [ROUTE.SHARE]: {
    params: {
      type: "object",
      properties: {
        targetThreadId: { type: "number" }
      },
      required: ["targetThreadId"],
      additionalProperties: false
    },
  } as const satisfies FastifySchema
}
