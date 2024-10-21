declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_HOST: string,
      POSTGRES_USER: string,
      POSTGRES_PASSWORD: string,
      POSTGRES_DB: string,
      PORT?: string,
      SESSION_SECRET: string,
      SENTRY_DSN?: string,
      ENVIRONMENT: "local" | "staging" | "production",
      POSTGRES_PORT?: string,
      POSTGRES_IDLE_TIMEOUT?: string,
      EMAIL_FROM: string,
      APP_BASE_URL?: string,
      GRACEFUL_SHUTDOWN_TIMEOUT?: string,
      SENTRY_VERSION?: string,
      SERPAPI_KEY: string,
      PREM_API_KEY: string,
      PREM_PROJECT_ID: string,
      ENHANCE_USER_QUERY: string,
      CHAT_MESSAGE_TIMEOUT: string,
      QUERY_ENHANCER_MODEL: string,
      DEFAULT_CHAT_MODEL: string,
      FOLLOW_UP_MODEL: string
      GITHUB_REPO_URL: string,
      OPENAI_KEY: string
    }
  }
}

export type Env = {
  POSTGRES_HOST: string
  POSTGRES_PORT: number,
  POSTGRES_USER: string,
  POSTGRES_PASSWORD: string,
  POSTGRES_DB: string,
  DB_MIGRATIONS_PATH: string,
  PORT: number,
  SENTRY_DSN?: string,
  ENVIRONMENT: "local" | "staging" | "production",
  POSTGRES_IDLE_TIMEOUT?: number,
  APP_BASE_URL: string,
  SENTRY_VERSION?: string,
  SESSION_SECRET: string,
  GRACEFUL_SHUTDOWN_TIMEOUT: number,
  SERPAPI_KEY: string,
  PREM_API_KEY: string,
  PREM_PROJECT_ID: number,
  ENHANCE_USER_QUERY: boolean,
  CHAT_MESSAGE_TIMEOUT: number,
  QUERY_ENHANCER_MODEL: string,
  DEFAULT_CHAT_MODEL: string,
  QUERY_ENHANCER_MODEL: string,
  FOLLOW_UP_MODEL: string,
  GITHUB_REPO_URL: string,
  OPENAI_KEY: string
}
