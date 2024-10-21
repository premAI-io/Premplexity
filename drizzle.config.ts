import { config } from "dotenv"
import type { Config } from "drizzle-kit"

const ALLOWED_TARGETS = ["local", "dev"]
const { TARGET = "local" } = process.env
const envMapping: {
  [key in typeof ALLOWED_TARGETS[number]]: string
} = {
  local: ".env.local",
  dev: ".env.dev",
}

if (!ALLOWED_TARGETS.includes(TARGET)) {
  throw new Error(`Invalid target: ${TARGET}`)
}

config({ path: envMapping[TARGET] })

const {
  POSTGRES_HOST,
  POSTGRES_PORT = "5432",
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env

if (!POSTGRES_HOST) {
  throw new Error("POSTGRES_HOST is not defined")
}

if (!POSTGRES_PORT) {
  throw new Error("POSTGRES_PORT is not defined")
}

if (!POSTGRES_USER) {
  throw new Error("POSTGRES_USER is not defined")
}

if (!POSTGRES_PASSWORD) {
  throw new Error("POSTGRES_PASSWORD is not defined")
}

if (!POSTGRES_DB) {
  throw new Error("POSTGRES_DB is not defined")
}

export default {
  schema: "./src/db_schemas",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: POSTGRES_HOST,
    port: +POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
  },

} satisfies Config
