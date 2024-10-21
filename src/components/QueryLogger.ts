import { Logger } from "drizzle-orm"

type OnQueryFn = (query: string, params: unknown[]) => void

export default class CustomLogger implements Logger {
  onQuery: OnQueryFn

  constructor(options?: {
    onQuery?: OnQueryFn
  }) {
    this.onQuery = options?.onQuery || (() => {})
  }

  logQuery(query: string, params: unknown[]): void {
    this.onQuery(query, params)
  }
}
