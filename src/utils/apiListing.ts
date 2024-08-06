import { CommonOptions, ServiceListingFn } from "$services/BaseService"
import { PgColumn } from "drizzle-orm/pg-core"
import { filterToDrizzleWhere } from "./filters"
import { sortersToDrizzleOrderBy } from "./sorters"
import { and } from "drizzle-orm"

export const apiListing = async <T>(options: {
  listingFn: ServiceListingFn<T>,
  limit: number
  offset: number
  filters?: unknown
  sorters?: unknown,

  acceptedFilters: PgColumn[],
  acceptedSorters: PgColumn[],

  listingCommonOptions?: CommonOptions
}): Promise<{
  values: T[],
  limit: number,
  offset: number,
  additionalResults: boolean
}> => {
  const {
    limit,
    offset,
    filters,
    sorters,
    listingFn,
    acceptedFilters,
    acceptedSorters,
    listingCommonOptions = {}
  } = options

  let where = filterToDrizzleWhere({ filters, schemas: acceptedFilters })
  const orderBy = sortersToDrizzleOrderBy({ sorters, schemas: acceptedSorters })

  if (listingCommonOptions.where) {
    where = and(listingCommonOptions.where, where)
    delete listingCommonOptions.where
  }

  const values = await listingFn({ limit: limit + 1, offset, where, orderBy, ...listingCommonOptions })

  let additionalResults = false
  if (values.length >= limit) {
    values.pop()
    additionalResults = true
  }

  return {
    limit,
    offset,
    additionalResults,
    values
  }
}
