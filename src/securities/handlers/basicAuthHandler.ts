import { FastifyReply, FastifyRequest } from "fastify"
import { SecurityHandlerFunction } from "$types/security"

const basicAuthHandler: SecurityHandlerFunction = async (req: FastifyRequest, reply: FastifyReply) => {
  const b64auth = (req.headers.authorization || "").split(" ")[1] || ""
  const [username, ...passwordArr] = Buffer.from(b64auth, "base64").toString().split(":")
  const password = passwordArr.join(":")

  if (!username || !password) {
    reply
      .header("WWW-Authenticate", "Basic realm=\"authentication\", charset=\"UTF-8\"")
      .status(401)
      .send("Authentication required.")

    return false
  }

  return true
}

export default basicAuthHandler
