/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyError, FastifyReply, FastifyRequest } from "fastify"
import ApiExtendedError from "$utils/ApiExtendedError"
import { container } from "tsyringe"
import Configs from "$components/Configs"
import * as Sentry from "@sentry/node"
import { omitSensitiveInformation } from "$utils/sensitiveObscurer"
import { formatJsonResponse, isApiRequest, formatBaseUserForSentry, hasToReturnJson } from "$plugins/utils"
import BaseLayout from "$templates/layouts/BaseLayout"

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
    // const callerUser = formatBaseUserForSentry(request.callerUser)
    // const authenticatedUser = formatBaseUserForSentry(request.authenticatedUser)

    const event: Sentry.Event = {
      message: `${statusCode} on ${request.url} - ${error.message}`,
      // user: callerUser,
      request: Sentry.extractRequestData(request.raw),
      level: "error",
      extra: {
        requestId: jsonResponse.requestId,
        code: jsonResponse.code,
        details: jsonResponse.details,
        stack: error.stack,
        // callerUser,
        // authenticatedUser,
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

  // WEBSITE
  // if (request.headers["hx-target"] === "page" || !request.headers["hx-target"]) {
  //   let page: JSX.Element
  //   const props = {
  //     loggedIn: !!request.callerUser
  //   }
  //   let responseStatus = jsonResponse.statusCode
  //   if (statusCode === 403) {
  //     page = NotFoundPage(props)
  //     responseStatus = 404
  //   } else {
  //     page = UnexpectedErrorPage(props)
  //   }
  //   const layoutFn = request.callerUser ? DashboardLayout : BaseLayout
  //   return reply.status(responseStatus).header("Hx-Retarget", "#page").header("Hx-Reswap", "outerHTML").view(page, layoutFn)
  // } else {
  //   let responseStatus = jsonResponse.statusCode
  //   let message = "An unexpected error occurred, we're already working on it. Try again later or contact us"
  //   if (statusCode === 403) {
  //     responseStatus = 404
  //     message = "The page you are looking for does not exist"
  //   }
  //   return reply.status(responseStatus).headers({
  //     "Hx-Retarget": "body",
  //     "Hx-Reswap": "none",
  //     "Hx-Trigger-After-Settle": `{"showErrorToast": "${message}"}`
  //   }).send("")
  // }
}
