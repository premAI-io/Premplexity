import ERROR_CODE from "../types/ERROR_CODE"

declare type ErrorDetails = { [name: string]: unknown } | undefined

class ApiExtendedError extends Error {
  __proto__: ErrorConstructor
  statusCode: number
  readonly details: ErrorDetails
  readonly code: ERROR_CODE

  constructor(
    code: ERROR_CODE,
    message: string,
    stack?: string,
    details?: ErrorDetails,
  ) {
    super(message)
    this.__proto__ = Error
    this.code = code
    if (stack) {
      this.stack = stack
    }
    this.details = details
    this.statusCode = ErrorStatusMapping[code]
    Object.setPrototypeOf(this, ApiExtendedError.prototype)
  }
}

export default ApiExtendedError

export const ErrorStatusMapping: { [key: string]: number } = {
  [ERROR_CODE.UNSUPPORTED_MEDIA_TYPE]: 415,
  [ERROR_CODE.VALIDATION_ERROR]: 400,
  [ERROR_CODE.NOT_FOUND]: 404,
  [ERROR_CODE.ROUTE_NOT_FOUND]: 404,
  [ERROR_CODE.NOT_IMPLEMENTED]: 501,
  [ERROR_CODE.UNEXPECTED_ERROR]: 500,
  [ERROR_CODE.INTERNAL_SERVER_ERROR]: 500,
  [ERROR_CODE.UNAUTHORIZED]: 401,
  [ERROR_CODE.FORBIDDEN]: 403
}

export const errorCodeMapping: { [key: number]: string } = {
  400: ERROR_CODE.VALIDATION_ERROR,
  401: ERROR_CODE.UNAUTHORIZED,
  403: ERROR_CODE.FORBIDDEN,
  404: ERROR_CODE.ROUTE_NOT_FOUND,
  405: ERROR_CODE.METHOD_NOT_ALLOWED,
  415: ERROR_CODE.UNSUPPORTED_MEDIA_TYPE,
  500: ERROR_CODE.UNEXPECTED_ERROR,
}

export const generateOpenAPIErrorSchema = (errors: ERROR_CODE[]) => {
  return errors.reduce((acc, error) => {
    const errorCode = String(ErrorStatusMapping[error])

    if (errorCode in acc) {
      acc[errorCode].properties.code.enum.push(error)
      return acc
    } else {
      return {
        ...acc,
        ...generateOpenAPIErrorDefinition(error),
      }
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as any)
}

export const generateOpenAPIErrorDefinition = (code: ERROR_CODE) => {
  return {
    [ErrorStatusMapping[code]]: {
      type: "object",
      properties: {
        requestId: {
          type: "string",
          description: "Request ID",
        },
        code: {
          type: "string",
          enum: [code],
        },
        statusCode: {
          type: "number",
          description: "HTTP status code",
        },
        message: {
          type: "string",
        },
        details: {
          type: "object",
          properties: {
            [code]: {
              type: "string",
            },
          },
          additionalProperties: false,
        },
        stack: {
          type: "string",
          description: "Stack trace of the error",
        },
      },
      required: ["code", "message", "statusCode"],
    },
  }
}
