import { SQL, and, eq, ne, gt, gte, lt, lte, like, ilike, notIlike, notLike, inArray, notInArray, or } from "drizzle-orm"
import { PgColumn } from "drizzle-orm/pg-core"
import { JSONSchema7 } from "json-schema"
import { FastifyInstance } from "fastify"

type IngressSimpleFilterMonoValue = {
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "like" | "ilike" | "not like" | "not ilike",
  value: string | number | boolean
}

type IngressSimpleFilterMultiValue = {
  operator: "in" | "not in",
  values: string[] | number[] | boolean[]
}

type IngressSimpleFilter = {
  field: string
} & (IngressSimpleFilterMonoValue | IngressSimpleFilterMultiValue)

const operatorMapping = {
  "=": eq,
  "!=": ne,
  ">": gt,
  "<": lt,
  ">=": gte,
  "<=": lte,
  "like": like,
  "ilike": ilike,
  "not like": notLike,
  "not ilike": notIlike,
  "in": inArray,
  "not in": notInArray
}

type IngressLogicalFilter = {
  connector: "and" | "or",
  filters: MonoFilter[]
}

type MonoFilter = IngressSimpleFilter | IngressLogicalFilter
type IngressFilter = unknown // The real type is (MonoFilter | MonoFilter[])
type DbSchema = PgColumn

const simpleFilterToDrizzleWhere = (filter: IngressSimpleFilter, dbSchema: DbSchema): SQL => {
  const normalizedValue = filter.operator === "in" || filter.operator === "not in" ? filter.values : (filter as IngressSimpleFilterMonoValue).value
  const operatorFn = operatorMapping[filter.operator] as (column: PgColumn, value: string | number | boolean | string[] | number[] | boolean[]) => SQL
  return operatorFn(dbSchema, normalizedValue)
}

const digFilter = (inputFilter: MonoFilter, dbSchemas: DbSchema[]): SQL | undefined => {
  if ("connector" in inputFilter) {
    const filter = inputFilter as IngressLogicalFilter
    const connector = filter.connector === "and" ? and : or
    return connector(...filter.filters.map(f => digFilter(f, dbSchemas)))
  } else {
    const filter = inputFilter as IngressSimpleFilter
    const dbSchema = dbSchemas.find(s => s.name === filter.field)

    if (!dbSchema) {
      throw new Error(`Error during filter parsing: field ${filter.field} not found in schema`)
    }

    return simpleFilterToDrizzleWhere(filter, dbSchema)
  }
}

export const filterToDrizzleWhere = (options: {
  filters?: IngressFilter,
  schemas: DbSchema[]
}): SQL | undefined => {
  const { filters, schemas } = options

  if (!filters) {
    return undefined
  }

  const startFilters = Array.isArray(filters) ? filters : [filters]
  return and(
    ...startFilters.map(f => digFilter(f, schemas))
  )
}

export type DrizzleToJsonSchemaInput = PgColumn[]

export type Filter = {
  type: "string" | "number" | "boolean" | "date-time",
  field: string
}

const getFilterSimpleLeafId = (id: string): string => `CommonSimpleLeaf${id}`
const getFilterLogicLeafId = (id: string): string => `LogicLeaf${id}`
const getFilterLeafId = (id: string): string => `Leaf${id}`

const pgTypeToJsonType = (pgType: PgColumn): JSONSchema7 => {
  switch (pgType.dataType) {
    case "string":
      if (pgType.enumValues) {
        return {
          type: "string",
          enum: pgType.enumValues
        }
      }

      if(pgType.columnType === "PgTimestampString") {
        return { type: "string", format: "date-time" }
      }

      return { type: "string" }
    case "number":
      return { type: "number" }
    case "boolean":
      return { type: "boolean" } 
  }

  throw new Error(`Unknown pg type ${pgType}`)
}

const getSpecificSimpleLeafJSONSchema = (options: {
  name: string,
  multiple?: boolean,
  operators: string[],
  coreFilterSchema: JSONSchema7
}): JSONSchema7 => {
  const coreProperties: {
    [key: string]: JSONSchema7
  } = options.multiple ? {
    values: {
      type: "array",
      items: options.coreFilterSchema
    }
  } : {
      value: options.coreFilterSchema
    }

  return {
    type: "object",
    title: options.multiple ? "Multiple" : "Single",
    additionalProperties: false,
    properties: {
      field: {
        type: "string",
        enum: [options.name]
      },
      operator: {
        type: "string",
        enum: options.operators
      },
      ...coreProperties
    },
    required: ["field", "operator", ...Object.keys(coreProperties)],
  }
}

const EQUALITY_OPERATORS = ["=", "!="]
const COMPARISON_OPERATORS = [...EQUALITY_OPERATORS, ">", "<", ">=", "<="]
const INCLUSION_OPERATORS = ["in", "not in"]
const LIKE_OPERATORS = ["like", "ilike", "not like", "not ilike"]

const getSingleSimpleLeafJSONSchema = (filterSchema: PgColumn): JSONSchema7[] => {
  const coreFilterSchema = pgTypeToJsonType(filterSchema)

  const generateJSONSchema = (options: { operators: string[], multiple: boolean }) => (
    getSpecificSimpleLeafJSONSchema({
      name: filterSchema.name,
      coreFilterSchema,
      multiple: options.multiple,
      operators: options.operators
    })
  )

  if (coreFilterSchema.type === "string") {
    if (coreFilterSchema.format === "date-time") {
      return [
        generateJSONSchema({ operators: COMPARISON_OPERATORS, multiple: false }),
        generateJSONSchema({ operators: INCLUSION_OPERATORS, multiple: true })
      ]
    }

    if (coreFilterSchema.enum?.length) {
      return [
        generateJSONSchema({ operators: EQUALITY_OPERATORS, multiple: false }),
        generateJSONSchema({ operators: INCLUSION_OPERATORS, multiple: true })
      ]
    }

    // base string
    return [
      generateJSONSchema({ operators: [...EQUALITY_OPERATORS, ...LIKE_OPERATORS], multiple: false }),
      generateJSONSchema({ operators: INCLUSION_OPERATORS, multiple: true })
    ]
  }

  if (coreFilterSchema.type === "number") {
    return [
      generateJSONSchema({ operators: COMPARISON_OPERATORS, multiple: false }),
      generateJSONSchema({ operators: INCLUSION_OPERATORS, multiple: true })
    ]
  }

  if (coreFilterSchema.type === "boolean") {
    return [
      generateJSONSchema({ operators: EQUALITY_OPERATORS, multiple: false })
    ]
  }

  throw new Error(`Unknown type ${JSON.stringify(coreFilterSchema)}`)
}

const getFilterSimpleLeafJSONSchema = (acceptedFilters: PgColumn[], id: string): JSONSchema7 => {
  const $id = getFilterSimpleLeafId(id)

  return {
    $id,
    title: "Single",
    anyOf: acceptedFilters.map(f => ({
      title: f.name,
      anyOf: getSingleSimpleLeafJSONSchema(f)
    }))
  }
}

const getFilterLogicLeafJSONSchema = (acceptedFilters: PgColumn[], id: string): JSONSchema7 => {
  const $id = getFilterLogicLeafId(id)

  return {
    $id,
    title: "Logical",
    type: "object",
    properties: {
      connector: {
        type: "string",
        enum: ["or", "and"]
      },
      filters: {
        type: "array",
        items: {
          anyOf: [
            { $ref: getFilterSimpleLeafId(id) },
            { $ref: getFilterLogicLeafId(id) }
          ]
        }
      }
    },
    additionalProperties: false,
    required: ["connector", "filters"]
  }
}

const getFilterLeafJSONSchema = (acceptedFilters: PgColumn[], id: string): JSONSchema7 => {
  const $id = getFilterLeafId(id)
  const logicalLeafId = getFilterLogicLeafId(id)
  const simpleLeafId = getFilterSimpleLeafId(id)

  return {
    $id,
    oneOf: [
      { $ref: simpleLeafId },
      { $ref: logicalLeafId },
      {
        title: "Multiple",
        type: "array",
        items: {
          anyOf: [
            { $ref: simpleLeafId },
            { $ref: logicalLeafId }
          ]
        }
      }
    ]
  }

}

let i = 0
export const generateFiltersSchema = (acceptedFilters: PgColumn[], server: FastifyInstance, id?: string): string => {
  if (!id) {
    id = `Filter${i++}`
  }

  const leaf = getFilterLeafJSONSchema(acceptedFilters, id)
  const logicalLeaf = getFilterLogicLeafJSONSchema(acceptedFilters, id)
  const simpleLeaf = getFilterSimpleLeafJSONSchema(acceptedFilters, id)

  server.addSchema(leaf)
  server.addSchema(logicalLeaf)
  server.addSchema(simpleLeaf)

  return leaf.$id!
}
