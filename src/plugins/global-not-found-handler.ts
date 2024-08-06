import { formatJsonResponse, hasToReturnJson } from "$plugins/utils"
import BaseLayout from "$templates/layouts/BaseLayout"
import NotFoundPage from "$templates/views/NotFoundView"
import ERROR_CODE from "$types/ERROR_CODE"
import ApiExtendedError from "$utils/ApiExtendedError"
import { FastifyRequest, FastifyReply } from "fastify"

export default (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const jsonResponse = formatJsonResponse(request, new ApiExtendedError(ERROR_CODE.NOT_FOUND, "Route not found"))

  const statusCode = jsonResponse.statusCode

  if (hasToReturnJson(request)) {
    return reply.code(statusCode).send(jsonResponse)
  }

  // WEBSITE

  // if (request.callerUser) {
  //   return reply.view(NotFoundPage({
  //     loggedIn: true
  //   }), DashboardLayout)
  // }

  return reply.view(NotFoundPage({}), BaseLayout)
}
