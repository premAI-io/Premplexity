/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyError, FastifyReply, FastifyRequest } from "fastify"
import ApiExtendedError from "$utils/ApiExtendedError"
import { container } from "tsyringe"
import Configs from "$components/Configs"
import * as Sentry from "@sentry/node"
import { omitSensitiveInformation } from "$utils/sensitiveObscurer"
import { formatJsonResponse, isApiRequest, hasToReturnJson } from "$plugins/utils"

const { env } = container.resolve<Configs>(Configs.token)
export default (
  error: FastifyError | ApiExtendedError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const jsonResponse = formatJsonResponse(request, error)
  const statusCode = jsonResponse.statusCode

  if (statusCode >= 500 && env.ENVIRONMENT === "local") {
    console.log(jsonResponse)
  }

  if (
    (
      statusCode >= 500 ||
      !isApiRequest(request)
    ) && ["staging", "production"].includes(env.ENVIRONMENT)
  ) {

    const event: Sentry.Event = {
      message: `${statusCode} on ${request.url} - ${error.message}`,
      request: Sentry.extractRequestData(request.raw),
      level: "error",
      extra: {
        requestId: jsonResponse.requestId,
        code: jsonResponse.code,
        details: jsonResponse.details,
        stack: error.stack,
        body: omitSensitiveInformation(request.body)
      }
    }

    Sentry.captureEvent(event, {
      originalException: error
    })
  }

  if (hasToReturnJson(request)) {
    return reply.code(statusCode).send(jsonResponse)
  }
}
