import { SQL, asc, desc } from "drizzle-orm"
import { PgColumn } from "drizzle-orm/pg-core"
import { FastifyInstance } from "fastify"
import { JSONSchema7 } from "json-schema"

type MonoSorter = string | { field: string, order?: "asc" | "desc" }
type InputSorter = unknown
type DbSchema = PgColumn


const getSorterId = (id: string): string => `sorter${id}`

export const generateSorterJSONSchema = (acceptedSorters: PgColumn[], id: string): JSONSchema7 => {
  const $id = getSorterId(id)
  const enumArray = acceptedSorters.map((column) => column.name)

  const monoSorterSchema: JSONSchema7 = {
    title: "Mono",
    anyOf: [{
      title: "Simple",
      type: "string",
      enum: enumArray.concat(enumArray.map((column) => `-${column}`))
    }, {
      title: "Complex",
      type: "object",
      additionalProperties: false,
      properties: {
        field: {
          type: "string",
          enum: enumArray
        },
        order: {
          type: "string",
          enum: ["asc", "desc"]
        }
      },
      required: ["field"]
    }]
  }

  return {
    $id,
    title: "Sorter",
    anyOf: [
      monoSorterSchema,
      {
        title: "Multi",
        type: "array",
        items: monoSorterSchema
      }
    ]
  }
}

let i = 0
export const generateSortersSchema = (acceptedSorters: PgColumn[], server: FastifyInstance, id?: string): string => {
  if (!id) {
    id = `Sorter${i++}`
  }

  const schema = generateSorterJSONSchema(acceptedSorters, id)
  server.addSchema(schema)
  return schema.$id!
}

export const sortersToDrizzleOrderBy = (options: {
  sorters?: InputSorter,
  schemas: DbSchema[]
}): SQL[] | undefined => {
  if (!options.sorters) {
    return
  }

  const sortersArray: MonoSorter[] = Array.isArray(options.sorters) ? options.sorters : [options.sorters]
  return sortersArray.map((sorter) => {
    let sorterName: string
    let order: typeof asc | typeof desc = asc

    if (typeof sorter === "string") {
      sorterName = sorter

      if (sorterName.startsWith("-")) {
        sorterName = sorterName.slice(1)
        order = desc
      }
    } else {
      sorterName = sorter.field

      if (sorter.order === "desc") {
        order = desc
      }
    }

    const column = options.schemas.find((schema) => schema.name === sorterName)
    if (!column) {
      throw new Error(`Error during sorting parsing: field ${sorter} not found in schema`)
    }

    return order(column)
  })
}
