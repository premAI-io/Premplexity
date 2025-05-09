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
      SENTRY_VERSION,
      SERPAPI_KEY,
      PREM_API_KEY,
      PREM_AI_BASE_URL = "https://sid.premai.io/api/v1",
      ENHANCE_USER_QUERY,
      QUERY_ENHANCER_MODEL,
      CHAT_MESSAGE_TIMEOUT = "5000",
      DEFAULT_CHAT_MODEL = "gpt-4o-mini",
      FOLLOW_UP_MODEL,
      GITHUB_REPO_URL = "https://github.com/premAI-io/Premplexity/",
    } = process.env

    for (const envKey of [
      "POSTGRES_USER",
      "POSTGRES_PASSWORD",
      "POSTGRES_DB",
      "SESSION_SECRET",
      "ENVIRONMENT",
      "SERPAPI_KEY",
      "PREM_API_KEY",
      "PREM_AI_BASE_URL",
      "ENHANCE_USER_QUERY",
      "QUERY_ENHANCER_MODEL",
      "FOLLOW_UP_MODEL",
      "DEFAULT_CHAT_MODEL",
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
      POSTGRES_IDLE_TIMEOUT: POSTGRES_IDLE_TIMEOUT
        ? +POSTGRES_IDLE_TIMEOUT
        : undefined,
      APP_BASE_URL,
      GRACEFUL_SHUTDOWN_TIMEOUT: +GRACEFUL_SHUTDOWN_TIMEOUT,
      SENTRY_VERSION,
      SERPAPI_KEY,
      PREM_API_KEY,
      PREM_AI_BASE_URL,
      ENHANCE_USER_QUERY: ENHANCE_USER_QUERY
        ? ENHANCE_USER_QUERY === "true"
        : false,
      CHAT_MESSAGE_TIMEOUT: +CHAT_MESSAGE_TIMEOUT,
      QUERY_ENHANCER_MODEL,
      DEFAULT_CHAT_MODEL,
      FOLLOW_UP_MODEL,
      GITHUB_REPO_URL,
    }
  }

  static token = Symbol("Configs")
}

container.registerSingleton(Configs.token, Configs)
