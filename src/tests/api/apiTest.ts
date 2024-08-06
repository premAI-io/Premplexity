import { test, describe, beforeEach, after } from "node:test"
import { container } from "tsyringe"
import Configs from "$components/Configs"
import Axios, { AxiosInstance } from "axios"
import {
  EventSourceWithJar,
} from "../utils"

import { wrapper } from "axios-cookiejar-support"
import { CookieJar } from "tough-cookie"
import PostgresDB from "$components/PostgresDB"

const postgresDB = container.resolve<PostgresDB>(PostgresDB.token)
const { env: { PORT } } = container.resolve<Configs>(Configs.token)


const BASE_URL = `http://localhost:${PORT}`

const jar = new CookieJar()

describe("API", async () => {
  let client: AxiosInstance

  beforeEach(() => {
    client = wrapper(
      Axios.create({
        jar,
        withCredentials: true,
        baseURL: BASE_URL,
        headers: {
          crossDomain: true
        },
        validateStatus: () => true
      })
    )

    EventSourceWithJar.cookieJar = jar
  })
})
