export const formatDate = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale)
}

export const formatDateTime = (date: Date, locale: string) => {
  return date.toLocaleString(locale, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
}

export const toTitleCase = (s: string): string => {
  return s[0].toUpperCase() + s.substring(1).toLocaleLowerCase()
}
