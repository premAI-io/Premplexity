import apiKeySecurityHandler from "./apiKeySecurityHandler"
import basicAuthHandler from "./basicAuthHandler"
import sessionSecurityHandler from "./sessionSecuritityHandler"

export default {
  session: sessionSecurityHandler,
  apiKey: apiKeySecurityHandler,
  basicAuth: basicAuthHandler
}
