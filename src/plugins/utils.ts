/* eslint-disable @typescript-eslint/no-explicit-any */
// import { BaseUser } from "$services/UsersService"
import ERROR_CODE from "$types/ERROR_CODE"
import { FastifyRequest, FastifyError } from "fastify"
import { env } from "process"

export const formatJsonResponse = <T extends FastifyError = FastifyError>(request: FastifyRequest, error: T) => {
  const response: {
    requestId: string
    statusCode: number
    code: string
    message?: string
    stack?: any
    details?: any
  } = {
    requestId: request.requestId,
    statusCode: error.statusCode || 500,
    code: error.code || ERROR_CODE.INTERNAL_SERVER_ERROR,
    details: (error as { details?: any }).details,
  }

  if (response.statusCode !== 500 || env.ENVIRONMENT !== "production") {
    response.message = error.message
  }

  if (env.ENVIRONMENT !== "production") {
    response.stack = error.stack
  }

  if (error.code === "FST_ERR_VALIDATION") {
    response.details = {
      validation: error.validation,
      validationContext: error.validationContext,
    }
  }

  return response
}

export const isApiRequest = (request: FastifyRequest) => {
  return request.url.includes("/api/")
}

export const hasToReturnJson = (request: FastifyRequest) => {
  // Add here any condition to return json
  return isApiRequest(request)
}

export const hasToReturnHtml = (request: FastifyRequest) => {
  // Add here any condition to return html
  return !hasToReturnJson(request)
}

// export const formatBaseUserForSentry = (user: BaseUser | null) => {
export const formatBaseUserForSentry = (user: any | null) => {
  if (!user) {
    return undefined
  }

  return {
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    type: user.userType
  }
}
