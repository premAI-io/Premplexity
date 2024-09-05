import { FastifyRequest } from "fastify"
import { SecurityHandlerFunction } from "$types/security"

const apiKeySecurityHandler: SecurityHandlerFunction = async (req: FastifyRequest): Promise<boolean> => {
  const apiKey = (req.headers["authorization"] || "").replace("Bearer ", "")

  if (!apiKey) {
    return false
  }

  return true
}

export default apiKeySecurityHandler
