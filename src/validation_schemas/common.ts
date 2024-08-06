import { JSONSchema7 } from "json-schema"

// Global max
const minInt = 0 as const
const minId = 1 as const
const maxInt = 1_000_000_000 as const
// Field max
const maxLimit = 50 as const
const defaultLimit = 10 as const
const defaultOffset = 0 as const
const shortStringMaxLength = 255 as const

export const limit = {
  type: "integer",
  minimum: minInt,
  maximum: maxLimit,
  default: defaultLimit
} as const satisfies JSONSchema7

export const offset = {
  type: "integer",
  minimum: minInt,
  maximum: maxInt,
  default: defaultOffset
} as const satisfies JSONSchema7

export const id = {
  type: "integer",
  minimum: minId,
  maximum: maxInt
} as const satisfies JSONSchema7

export const email = {
  type: "string",
  minLength: minInt,
  maxLength: shortStringMaxLength
} as const satisfies JSONSchema7

export const timestamp = {
  type: "string",
  format: "date-time"
} as const satisfies JSONSchema7

export const nullValue = {
  type: "null"
} as const satisfies JSONSchema7

export const nullableTimestamp = {
  oneOf: [timestamp, nullValue]
} as const satisfies JSONSchema7

export const shortString = {
  type: "string",
  maxLength: shortStringMaxLength
} as const satisfies JSONSchema7

export const nullableShortString = {
  oneOf: [shortString, nullValue]
} as const satisfies JSONSchema7

export const name = {
  type: "string",
  minLength: minInt,
  maxLength: shortStringMaxLength
} as const satisfies JSONSchema7

export const multipleSelectionSchema = {
  anyOf: [
    { type: "string" },
    { type: "array", items: { type: "string" } }
  ]
} as const satisfies JSONSchema7
