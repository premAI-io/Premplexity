import { FastifyReply, FastifyRequest } from "fastify"

export type OpenapiSecurityObject = {
  [securityLabel: string]: readonly string[];
}[]

export type SecurityHandlerFunction = (req: FastifyRequest, reply: FastifyReply, scopes: readonly string[]) => Promise<boolean>
