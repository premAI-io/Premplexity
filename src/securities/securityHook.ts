import { OpenapiSecurityObject, SecurityHandlerFunction } from "$types/security"
import { FastifyReply, FastifyRequest } from "fastify"
import ApiExtendedError from "$utils/ApiExtendedError"
import ERROR_CODE from "$types/ERROR_CODE"


const extractSecurity = (req: FastifyRequest): OpenapiSecurityObject => {
  const out: OpenapiSecurityObject = []

  if (req.routeOptions.config.security?.apiKey) {
    out.push({ apiKey: [] })
  }

  if (req.routeOptions.config.security?.session) {
    out.push({ session: [req.routeOptions.config.security.session] })
  }

  if (req.routeOptions.config.security?.basicAuth) {
    out.push({ basicAuth: [] })
  }

  return out
}

export default (securityHandlers: Record<string, SecurityHandlerFunction>) => async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const additionalSecurity = extractSecurity(req)
  const securitySchema = (req.routeOptions?.schema?.security || []).concat(additionalSecurity)

  const skipSecurity = securitySchema.length === 0
  if (skipSecurity) {
    return
  }

  let hasEmptySecurity = false
  for (const i in securitySchema) {
    const security = securitySchema[i]

    if (Object.entries(security).length === 0) {
      hasEmptySecurity = true
    }
  }

  // empty security ( {} ), always pass
  if (hasEmptySecurity) {
    return
  }

  // validate securities
  let securityPassed = false
  for (const i in securitySchema) {
    const security = securitySchema[i]
    let partialPassed = true

    for (const [securityKey, scopes] of Object.entries(security)) {
      const securityHandler = securityHandlers[securityKey]
      const valid = await securityHandler(req, reply, scopes)

      partialPassed = partialPassed && valid
      if (!partialPassed && reply.sent) {
        return
      }
    }

    if (partialPassed) {
      securityPassed = true
      break
    }
  }

  if (!securityPassed) {
    throw new ApiExtendedError(ERROR_CODE.FORBIDDEN, "Security check failed")
  }

  return
}
