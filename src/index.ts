// FASTIFY RELATED IMPORTS
import Fastify from "fastify"
import fastifyStatic from "@fastify/static"
import fastifyFormBody from "@fastify/formbody"
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts"

import fastifySession from "@fastify/session"
import fastifyCookie from "@fastify/cookie"
import fastifySwagger from "@fastify/swagger"
import fastifyRateLimit from "@fastify/rate-limit"

// ROUTERS
import apiRootRouter from "./routers/api/apiRootRouter"
import viewsRouter from "./routers/website/viewsRouter"
import actionsRouter from "./routers/website/actionsRouter"
import partialsRouter from "./routers/website/partialsRouter"

// COMPONENTS
import PostgresDB from "$components/PostgresDB"
import DrizzleDB from "$components/DrizzleDB"
import DrizzleSessionStore from "$components/DrizzleSessionStore"
import Configs from "$components/Configs"
import SerpAPI from "$components/SerpAPI"
import PremAI from "$components/PremAI"
import ThredCore from "$components/ThreadCore"

// SERVICES
import UsersService, { BaseUser } from "$services/UsersService"

// SECURITY
import securityHook from "src/securities/securityHook"
import securityHandlers from "src/securities/handlers"

// OTHERS
import meta from "./meta.json"
import * as Sentry from "@sentry/node"
import { container } from "tsyringe"
import { GlobalResources, LayoutFn } from "./types"
import WebappSSEManager from "$components/WebappSSEManager"
import globalErrorHandler from "$plugins/global-error-handler"
import globalNotFoundHandler from "$plugins/global-not-found-handler"
import { join } from "path"
import { createReadStream } from "fs"
import { getHtmxBrowserUrl, getLocale } from "$routers/website/utils"

declare module "fastify" {
  interface FastifyRequest {
    callerUser: BaseUser

    requestId: string
    startTimestamp: Date
    globalResources: GlobalResources

    locale: string,
    routers: Array<string>
  }

  interface FastifyReply {
    view: (jsx: JSX.Element, layoutFn?: LayoutFn) => FastifyReply
  }

  interface Session {
    data: {
      callerUserId: number
    }
  }
  interface FastifyContextConfig {
    security?: {
      apiKey?: boolean
      session?: string,
      basicAuth?: boolean
    }
  }
}

const FAVICON_PATH = Object.keys(meta.outputs!)
  .find((filename) => filename.endsWith(".ico"))!
  .split("/")
  .slice(1)
  .join("/")
  .split("public/")[1]
const ESBUILD_STYLE_BUNDLE_PATH =
  "/" +
  Object.keys(meta.outputs!)
    .find((filename) => filename.endsWith(".css"))!
    .split("/")
    .slice(1)
    .join("/")
const ESBUILD_SCRIPT_BUNDLE_PATH =
  "/" +
  Object.keys(meta.outputs!)
    .find((filename) => filename.endsWith(".js"))!
    .split("/")
    .slice(1)
    .join("/")


void (async () => {
  const { env } = container.resolve<Configs>(Configs.token)
  const drizzleDB = container.resolve<DrizzleDB>(DrizzleDB.token)
  const usersService = container.resolve<UsersService>(UsersService.token)
  const serpAPI = container.resolve<SerpAPI>(SerpAPI.token)
  const premAI = container.resolve<PremAI>(PremAI.token)
  const threadCore = container.resolve<ThredCore>(ThredCore.token)
  let isShuttingDown = false

  const gracefulShutdown = (signal: string) => async () => {
    isShuttingDown = true

    if (env.ENVIRONMENT === "local") {
      process.kill(process.pid, signal)
    }

    setTimeout(async () => {
      console.warn("Forcing shutdown")
      process.exit(0)
    }, env.GRACEFUL_SHUTDOWN_TIMEOUT)
  }

  process.on("SIGINT", gracefulShutdown("SIGINT"))
  process.on("SIGTERM", gracefulShutdown("SIGTERM"))

  if (env.ENVIRONMENT === "local") {
    process.on("SIGUSR2", gracefulShutdown("SIGUSR2"))
  }

  const server = Fastify({
    ajv: {
      customOptions: {
        allErrors: true,
        useDefaults: true,
        removeAdditional: false
      },
    },
  }).withTypeProvider<JsonSchemaToTsProvider>()

  server.setSerializerCompiler(() => (data) => JSON.stringify(data))
  server.setReplySerializer((payload) => JSON.stringify(payload))

  const drizzleSessionStore = container.resolve<DrizzleSessionStore>(DrizzleSessionStore.token)

  const { init: sseManagerInit } = container.resolve<WebappSSEManager>(WebappSSEManager.token)
  await sseManagerInit()

  server.register(fastifyCookie)
  server.register(fastifySession, {
    secret: env.SESSION_SECRET,
    cookie: {
      secure: "auto",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    },
    saveUninitialized: false,
    store: drizzleSessionStore.store,
  })

  await server.register(fastifyRateLimit, {
    max: env.ENVIRONMENT === "local" ? 10000 : 50,
    timeWindow: 1000,
  })

  server.addHook("onRequest", async (req, reply) => {
    if (isShuttingDown) {
      return reply.code(503).send("Server is shutting down")
    }
  })

  server.addHook("onRequest", async (req) => {
    req.routers = []

    const isMobile = req.headers["user-agent"]?.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)

    req.globalResources = {
      FAVICON_PATH,
      ESBUILD_STYLE_BUNDLE_PATH,
      ESBUILD_SCRIPT_BUNDLE_PATH,
      RECAPTCHA_V2_SITE_KEY: env.RECAPTCHA_V2_SITE_KEY,
      RECAPTCHA_V3_SITE_KEY: env.RECAPTCHA_V3_SITE_KEY,
      IS_MOBILE: !!isMobile
    }

    req.locale = getLocale(req.headers["accept-language"])

    req.startTimestamp = new Date()
    req.requestId = Math.random().toString(36).slice(2) + Date.now().toString(36)

    let callerUser

    if (req.session?.data?.callerUserId) {
      const { callerUserId } = req.session.data
      callerUser = await usersService.get(callerUserId)

      if (!callerUser) {
        console.error(`Caller user ID ${callerUserId} in session not found`)
        await req.session.destroy()
      }
    }

    if (!callerUser) {
      callerUser = await usersService.createAnonymousUser()

      req.session.data = {
        callerUserId: callerUser.id
      }
    }

    req.callerUser = callerUser
  })

  server.addHook("preHandler", async (req) => {
    // INJECT TARGETS
    const promises: Promise<void>[] = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestQuery = (req.query || {}) as Record<string, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestBody = (req.body || {}) as Record<string, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestParams = (req.params || {}) as Record<string, any>

    await Promise.all(promises)
  })

  server.addHook("preHandler", securityHook(securityHandlers))

  server.addHook("onSend", (req, reply, payload, done) => {
    if (!reply.sent) {
      reply.header("X-Request-Id", req.requestId)
    }

    return done(null, payload)
  })

  server.register(fastifyFormBody)
  server.register(fastifyStatic, {
    root: join(__dirname, "public"),
    prefix: "/public/",
  })

  server.register(fastifySwagger, {
    openapi: {
      openapi: "3.1.0",
      components: {
        securitySchemes: {
          apiKey: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
          },
          session: {
            type: "apiKey",
            name: "premplexity.session.id",
            in: "cookie"
          },
          basicAuth: {
            type: "http",
            scheme: "basic"
          }
        }
      }
    },
    transform: (obj) => {
      if (obj) {
        if (!obj.schema) {
          Object.assign(obj, { schema: {} })
        }

        if (!obj.schema.tags) {
          obj.schema.tags = []
        }

        if (!obj.schema.security) {
          obj.schema.security = []
        }

        if (obj.route.config?.security?.apiKey) {
          obj.schema.security = obj.schema.security.concat({ apiKey: [] })
        }

        if (obj.route.config?.security?.session) {
          obj.schema.security = obj.schema.security.concat({ session: [] })
        }

        if (obj.route.config?.security?.basicAuth) {
          obj.schema.security = obj.schema.security.concat({ basicAuth: [] })
        }

        if (!obj.url.startsWith("/api/")) {
          obj.schema.hide = true
        }
      }

      return obj
    },
    refResolver: {
      buildLocalReference(json, baseUri, fragment, i) {
        return (json.$id || `def-${i}`).toString()
      }
    }
  })

  server.decorateReply(
    "view",
    function (jsx: JSX.Element | string, layout?: LayoutFn) {
      let out
      if (layout) {
        out = layout({
          children: jsx.toString(),
          globalResources: this.request.globalResources,
          isHtmxRequest: this.request.headers["hx-request"] === "true",
          routerName: ""
          // this.request.routers?.at(-1) || "root"
        })
      } else {
        out = jsx.toString()
      }

      void this.type("text/html")
      return this.send(out)
    }
  )

  server.get("/favicon.ico", (_, reply) => {
    const faviconPath = join(__dirname, "public", FAVICON_PATH)
    const stream = createReadStream(faviconPath, "utf-8")
    reply.header("Content-Type", "application/octet-stream")
    return reply.send(stream)
  })

  server.setErrorHandler(globalErrorHandler)
  server.setNotFoundHandler(globalNotFoundHandler)

  server.register(apiRootRouter, { prefix: "/api" })
  server.register(viewsRouter, { prefix: "/" })
  server.register(actionsRouter, { prefix: "/actions" })
  server.register(partialsRouter, { prefix: "/partials" })

  await server.ready()
  await server.listen({
    port: env.PORT,
    host: "0.0.0.0",
  })

  console.log(`Server listening on http://localhost:${env.PORT}`)
})()
  .catch((err) => {
    console.error("Error starting server", err)

    try {
      Sentry.captureException(err)
    } catch (err) {
      console.error("Error capturing exception", err)
    }
  })
