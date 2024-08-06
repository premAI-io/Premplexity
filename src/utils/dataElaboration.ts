export const getEnumStrings = (enumType: Record<string, string>) => {
  return Object.values(enumType) as [string, ...string[]]
}

export function filterValue<Value>(allowedValues: Value[], value?: string): Value | undefined {
  return allowedValues.includes(value as Value) ? value as Value : undefined
}

export function filterQuerystringValues<Value>(allowedValues: Value[], query?: string | string[]): Value[] {
  if (!query) {
    return []
  }

  if (typeof query === "string") {
    return allowedValues.includes(query as Value) ? [query as Value] : []
  }

  return query.filter(v => allowedValues.includes(v as Value)) as Value[]
}
