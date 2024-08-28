import "reflect-metadata"
import { Env } from "$types/Env"
import { join } from "path"
import { container, singleton } from "tsyringe"

const checkEnv = (envKey: string) => {
  if (process.env[envKey] === undefined) {
    throw new Error(`Missing required environment variable ${envKey}`)
  }
}

@singleton()
export default class Configs {
  env: Env

  constructor() {
    const {
      POSTGRES_HOST = "localhost",
      POSTGRES_PORT = "5432",
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_DB,
      SESSION_SECRET,
      PORT = "3000",
      SENTRY_DSN,
      ENVIRONMENT,
      POSTGRES_IDLE_TIMEOUT,
      APP_BASE_URL = "http://localhost:3000",
      GRACEFUL_SHUTDOWN_TIMEOUT = "0",
      RECAPTCHA_ACTIVE,
      RECAPTCHA_V2_SECRET,
      RECAPTCHA_V2_SITE_KEY,
      RECAPTCHA_V3_SECRET,
      RECAPTCHA_V3_SITE_KEY,
      SENTRY_VERSION,
      SERPAPI_KEY,
      PREM_API_KEY,
      PREM_PROJECT_ID,
      ENHANCE_USER_QUERY,
      QUERY_ENHANCER_MODEL,
      CHAT_MESSAGE_TIMEOUT = "5000",
      DEFAULT_CHAT_MODEL = "gpt-4o-mini",
      FOLLOW_UP_MODEL
    } = process.env

    for (const envKey of [
      "POSTGRES_USER",
      "POSTGRES_PASSWORD",
      "POSTGRES_DB",
      "SESSION_SECRET",
      "ENVIRONMENT",
      "RECAPTCHA_V2_SECRET",
      "RECAPTCHA_V2_SITE_KEY",
      "RECAPTCHA_V3_SECRET",
      "RECAPTCHA_V3_SITE_KEY",
      "SERPAPI_KEY",
      "PREM_API_KEY",
      "PREM_PROJECT_ID",
      "ENHANCE_USER_QUERY",
      "QUERY_ENHANCER_MODEL",
      "FOLLOW_UP_MODEL",
      "DEFAULT_CHAT_MODEL"
    ]) {
      checkEnv(envKey)
    }

    this.env = {
      POSTGRES_DB,
      POSTGRES_HOST,
      POSTGRES_PASSWORD,
      POSTGRES_PORT: +POSTGRES_PORT,
      POSTGRES_USER,
      DB_MIGRATIONS_PATH: join(__dirname, "../../migrations"),
      PORT: +PORT,
      SESSION_SECRET,
      SENTRY_DSN,
      ENVIRONMENT,
      POSTGRES_IDLE_TIMEOUT: POSTGRES_IDLE_TIMEOUT ? +POSTGRES_IDLE_TIMEOUT : undefined,
      APP_BASE_URL,
      GRACEFUL_SHUTDOWN_TIMEOUT: +GRACEFUL_SHUTDOWN_TIMEOUT,
      RECAPTCHA_ACTIVE: RECAPTCHA_ACTIVE ? RECAPTCHA_ACTIVE === "true" : true,
      RECAPTCHA_V2_SECRET,
      RECAPTCHA_V2_SITE_KEY,
      RECAPTCHA_V3_SECRET,
      RECAPTCHA_V3_SITE_KEY,
      SENTRY_VERSION,
      SERPAPI_KEY,
      PREM_API_KEY,
      PREM_PROJECT_ID: +PREM_PROJECT_ID,
      ENHANCE_USER_QUERY: ENHANCE_USER_QUERY ? ENHANCE_USER_QUERY === "true" : false,
      CHAT_MESSAGE_TIMEOUT: +CHAT_MESSAGE_TIMEOUT,
      QUERY_ENHANCER_MODEL,
      DEFAULT_CHAT_MODEL,
      FOLLOW_UP_MODEL
    }
  }


  static token = Symbol("Configs")
}

container.registerSingleton(Configs.token, Configs)
