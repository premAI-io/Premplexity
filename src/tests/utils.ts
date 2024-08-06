import { Ajv } from "ajv"
import ajvFormats from "ajv-formats"
import { JSONSchema7 } from "json-schema"

import EventSource from "eventsource"
import { CookieJar } from "tough-cookie"


export const checkJsonSchema = async (input: unknown, schema: JSONSchema7, additionalSchema?: JSONSchema7) => {
  const ajv = new Ajv()
  ajvFormats(ajv)
  if (additionalSchema) {
    ajv.addSchema(additionalSchema)
  }
  const validate = ajv.compile(schema)
  const out = validate(input)
  return out
}

export class EventSourceWithJar extends EventSource {
  static cookieJar: CookieJar | undefined

  constructor(url: string) {
    super(url, EventSourceWithJar.cookieJar !== undefined ? {
      headers: {
        Cookie: EventSourceWithJar.cookieJar.getCookieStringSync(url)
      }
    } : undefined)
  }
}
