import { FastifyRequest } from "fastify"
import { SecurityHandlerFunction } from "$types/security"
// import ApiKeysService from "$services/ApiKeysService"

const apiKeySecurityHandler: SecurityHandlerFunction = async (req: FastifyRequest): Promise<boolean> => {
  const apiKey = (req.headers["authorization"] || "").replace("Bearer ", "")

  if (!apiKey) {
    return false
  }

  // const apiKeyService = req.services.apiKeys
  // const hashedApiKey = ApiKeysService.hashKey(apiKey)

  // const apiKeyEntity = await apiKeyService.getByHashedKey(hashedApiKey)
  // if (!apiKeyEntity) {
  //   return false
  // }

  // await apiKeyService.touchLastTimeUsed(apiKeyEntity.id)

  return true
}

export default apiKeySecurityHandler
