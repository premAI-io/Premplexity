import { FastifyJsonSchemaInstance } from "$types/index"
import { ContextConfigDefault, FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest, FastifyRequestContext, FastifySchema, RouteGenericInterface, preHandlerHookHandler } from "fastify"
import { FastifyTypeProviderDefault, ResolveFastifyReplyReturnType } from "fastify/types/type-provider"
import { THREAD_ACTIONS_ROUTE, threadRouterPrefix } from "./actionsRouter/thread"
import { THREAD_PARTIALS_ROUTE } from "$routers/website/partialsRouter/thread/index"

// ==================== ROUTER ==================== //

export function createRouter(callback: (server: FastifyJsonSchemaInstance) => void): FastifyPluginCallback {
  return (server, _, done) => {
    callback(server)
    return done()
  }
}

// ==================== ACTIONS ==================== //

export function registerActionsRouter(server: FastifyInstance, router: FastifyPluginCallback, prefix?: `/${string}`) {
  server.register((instance, _opts, done) => {
    const routerName = prefix?.substring(1) || "root"

    instance.addHook("preHandler", (request, _res, done) => {
      if (!request.routers) {
        request.routers = []
      }
      request.routers.push(routerName)

      return done()
    })

    instance.addHook("onError", async (_req, res, error) => {
      console.error("actions router onError", error)
      if (error.validation) {
        return res.status(400).send(error.validation)
      }
      return res.status(500).send(`An unexpected error occurred: ${error.message}`)
    })

    instance.register(router)

    return done()
  }, { prefix })
}

type ActionRouter =
| "thread"

type ActionRoutersPaths = {
  thread: typeof THREAD_ACTIONS_ROUTE
}

const actionRoutersConfig: {
  [key in ActionRouter]: {
    paths: ActionRoutersPaths[key]
    prefix?: `/${string}`
  }
} = {
  thread: {
    paths: THREAD_ACTIONS_ROUTE,
    prefix: threadRouterPrefix
  }
}

type ActionRoutersParams = {
  thread: {
    SEND_MESSAGE: { targetThreadId: number }
    DELETE: { targetThreadId: number }
  }
}

export function getActionPath<R extends ActionRouter, P extends keyof ActionRoutersPaths[R]>(
  router: R,
  routeName: P,
  ...params: R extends keyof ActionRoutersParams ? (P extends keyof ActionRoutersParams[R] ? [params: ActionRoutersParams[R][P]] : [params?: undefined]) : [params?: undefined]
) {
  return getPath({
    rootPrefix: "/actions",
    routerPrefix: actionRoutersConfig[router].prefix || undefined,
    path: actionRoutersConfig[router].paths[routeName] as `/${string}`,
    params: params ? {
      ...params[0]
    } : undefined
  })
}

// ==================== PARTIALS ==================== //

type PartialRouter =
| "thread"

type PartialRoutersPaths = {
  thread: typeof THREAD_PARTIALS_ROUTE
}

const partialRoutersConfig: {
  [key in PartialRouter]: {
    paths: PartialRoutersPaths[key]
    prefix?: `/${string}`
  }
} = {
  thread: {
    paths: THREAD_PARTIALS_ROUTE,
    prefix: threadRouterPrefix
  }
}

type PartialsRoutersParams = {
  thread: {
    DELETE_MODAL: { targetThreadId: number },
    SOURCES_MODAL: { targetThreadId: number, targetMessageId: number },
    IMAGES_LISTING: { targetThreadId: number, targetMessageId: number, targetImageOrder: number },
    IMAGE: { targetThreadId: number, targetMessageId: number, targetImageOrder: number },
  }
}

export function getPartialPath<R extends PartialRouter, P extends keyof PartialRoutersPaths[R]>(
  router: R,
  routeName: P,
  ...params: R extends keyof PartialsRoutersParams ? (P extends keyof PartialsRoutersParams[R] ? [params: PartialsRoutersParams[R][P]] : [params?: undefined]) : [params?: undefined]
) {
  return getPath({
    rootPrefix: "/partials",
    routerPrefix: partialRoutersConfig[router].prefix || undefined,
    path: partialRoutersConfig[router].paths[routeName] as `/${string}`,
    params: params ? {
      ...params[0]
    } : undefined
  })
}

// ==================== VIEWS ==================== //

export function registerViewsRouter(server: FastifyInstance, router: FastifyPluginCallback, prefix?: `/${string}`) {
  server.register((instance, _opts, done) => {
    const routerName = prefix?.substring(1) || "root"

    instance.addHook("preHandler", (request, _res, done) => {
      if (!request.routers) {
        request.routers = []
      }
      request.routers.push(routerName)

      return done()
    })

    instance.register(router)

    return done()
  }, { prefix })
}

type AuthenticatedRequest<Schema extends RouteGenericInterface = RouteGenericInterface> = Omit<FastifyRequest<Schema>, "authenticatedUser" | "callerUser" | "routers"> & {
  // authenticatedUser: BaseUser
  // callerUser: BaseUser
  routers: string[]
}
const privateRoutePreHandler: preHandlerHookHandler = (req, res, done) => {
  // if (!req.callerUser) {
  //   if (isHtmxRequest(req)) {
  //     res.header("HX-Location", "/").send()
  //   } else {
  //     res.redirect("/")
  //     return
  //   }
  // }

  return done()
}
export function registerPrivateRoute<Schema extends RouteGenericInterface>(
  server: FastifyInstance,
  path: string,
  handler: (req: AuthenticatedRequest<Schema>, res: FastifyReply) => ResolveFastifyReplyReturnType<FastifyTypeProviderDefault, FastifySchema, Schema>,
  config?: Omit<FastifyRequestContext<ContextConfigDefault>["config"], "url" | "method">
) {
  server.route<Schema>({
    method: "GET",
    url: path,
    config,
    preHandler: privateRoutePreHandler,
    handler: (req, res) => handler(req as AuthenticatedRequest<Schema>, res)
  })
}

/*
  Not authenticated routes
  - The user is redirected to settings page if authenticated
  - If not authenticated, `user` is inferred as `null` so that it can be type-safely used in the handler
*/
// type NotAuthenticatedRequest<Schema extends RouteGenericInterface = RouteGenericInterface> = Omit<FastifyRequest<Schema>, "authenticatedUser" | "callerUser" | "routers"> & {
//   authenticatedUser: null
//   callerUser: null
//   routers: string[]
// }

const authRoutePreHandler: preHandlerHookHandler = (req, res, done) => {
  // if (req.callerUser) {
  //   if (isHtmxRequest(req)) {
  //     res.header("HX-Location", "/settings").send()
  //   } else {
  //     res.redirect("/settings")
  //     return
  //   }
  // }

  return done()
}

// export function registerAuthRoute<Schema extends RouteGenericInterface>(
//   server: FastifyInstance,
//   path: string,
//   handler: (req: NotAuthenticatedRequest<Schema>, res: FastifyReply) => ResolveFastifyReplyReturnType<FastifyTypeProviderDefault, FastifySchema, Schema>
// ) {
//   server.route<Schema>({
//     method: "GET",
//     url: path,
//     preHandler: authRoutePreHandler,
//     handler: (req, res) => handler(req as NotAuthenticatedRequest<Schema>, res)
//   })
// }

// ==================== HELPERS ==================== //

type GetPathOptions = {
  rootPrefix: `/${string}`
  routerPrefix?: `/${string}`,
  path: `/${string}`,
  params?: { [key: string]: string | number }
}
function getPath(options: GetPathOptions): string {
  const { rootPrefix, routerPrefix, path, params } = options
  let result = `${rootPrefix}${routerPrefix ?? ""}${path}`
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`:${key}`, `${value}`)
    })
  }
  return result
}

export const isHtmxRequest = (req: FastifyRequest) => req.headers["hx-request"]?.toString().toLowerCase() === "true"

export const getHtmxBrowserUrl = (req: FastifyRequest): URL | null => {
  const currentUrlHeader = req.headers["hx-current-url"] as string
  if (!currentUrlHeader) {
    return null
  }
  return new URL(currentUrlHeader)
}

export function getQuerystringFromUrl<Schema extends object>(url: URL) {
  const params: Record<string, string | string[]> = {}

  // Needed to properly parse fields with same names but different values
  for (const [key, value] of url.searchParams.entries()) {
    if (Object.hasOwnProperty.call(params, key)) {
      if (!Array.isArray(params[key])) {
        params[key] = [params[key] as string]
      }
      (params[key] as string[]).push(value)
    } else {
      params[key] = value
    }
  }
  return params as Schema
}

export function getQuerystringFromUrlString<Schema extends object>(url: string) {
  return getQuerystringFromUrl(new URL(url)) as Schema
}

export function buildQuerystringFromFiltersAndSorter(filters: Record<string, string | string[] | undefined>, sorter: string | undefined) {
  const searchParams = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(value => searchParams.append(key, value))
      } else {
        searchParams.append(key, value)
      }
    }
  })
  if (sorter) {
    searchParams.append("sorter", sorter)
  }
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

export function getDropDownStyle(stringObj: string, newItemsLenght: number): {
  left: number
  top: number
} {
  const obj = JSON.parse(stringObj)

  const diff = parseInt(obj.currentItems) - newItemsLenght
  const offset = diff > 0 ? diff * parseInt(obj.itemHeight) : 0


  return {
    left: parseInt(obj.left.replace("px", "")),
    top: parseInt(obj.top.replace("px", "")) + offset
  }
}

export const getLocale = (acceptLanguage: string | undefined) => {
  let locale = "IT-it"

  if (!acceptLanguage) {
    return locale
  }

  const locales = acceptLanguage.split(",").map(l => l.trim())
  locale = locales[0].split(";")[0]

  return locale
}
