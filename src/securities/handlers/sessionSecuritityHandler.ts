import USER_ROLE from "$types/USER_ROLES"
import { SecurityHandlerFunction } from "$types/security"
import { captureException } from "@sentry/node"
import { evaluate } from "mathjs"

const getUserRoles = async (): Promise<USER_ROLE[]> => {
  const roles: USER_ROLE[] = []

  return roles
}

const allRoles = Object.keys(USER_ROLE).sort(
  (a, b) => b.length - a.length
) as USER_ROLE[]
const roleRegex = /^(true|false|not|\s|\|\||\(|\)|&&|!)+$/

const sessionSecurityHandler: SecurityHandlerFunction = async (
  req,
  _res,
  scopes
): Promise<boolean> => {
  if (scopes.length > 1) {
    throw new Error("Invalid roles format")
  }

  if (scopes.length === 0) {
    return true
  }

  const scope = scopes[0]

  if (!req.session.data) {
    return false
  }

  const userRoles: USER_ROLE[] = await getUserRoles()

  let expression: string = allRoles.reduce(
    (acc: string, e) =>
      acc.replace(new RegExp(e, "g"), userRoles.includes(e).toString()),
    scope
  )

  if (!roleRegex.test(expression)) {
    throw new Error(`Invalid role values: ${scope}`)
  }

  expression = expression.replace(/\|\|/g, "or").replace(/&&/g, "and").replace(/!/g, "not")

  try {
    if (!evaluate(expression) as boolean) {
      return false
    }
  } catch (e) {
    captureException(e)
    return false
  }

  return true
}

export default sessionSecurityHandler
