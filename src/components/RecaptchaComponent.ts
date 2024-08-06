import axios from "axios"
import { container, inject, singleton } from "tsyringe"
import Configs from "./Configs"
import { Env } from "$types/Env"

@singleton()
export default class RecatpchaComponent {
  readonly #v3Secret: string
  readonly #v2Secret: string
  readonly shouldVerify: boolean
  readonly environment: Env["ENVIRONMENT"]

  BASE_URL = "https://www.google.com/recaptcha/api/siteverify"

  constructor(
    @inject(Configs.token)
    configs: Configs
  ) {
    this.#v3Secret = configs.env.RECAPTCHA_V3_SECRET
    this.#v2Secret = configs.env.RECAPTCHA_V2_SECRET
    this.shouldVerify = configs.env.RECAPTCHA_ACTIVE
    this.environment = configs.env.ENVIRONMENT
  }

  _checkCode = async ({
    token,
    secret
  }: {
    token: string,
    secret: string
  }): Promise<boolean> => {
    try {
      const { data } = await axios.post(`${this.BASE_URL}?secret=${secret}&response=${token}`)
      const success: boolean = data.success
      return success
    } catch (_) {
      return false
    }
  }

  verifyToken = async (data: {
    token: string,
    throwOnError?: boolean,
    testModeSkipValidation?: boolean
  }): Promise<boolean> => {
    const skipValidation = ["local", "staging"].includes(this.environment) && data.testModeSkipValidation

    if (!this.shouldVerify || skipValidation) {
      return true
    }

    const {
      token,
      throwOnError = true
    } = data

    let success = await this._checkCode({
      token,
      secret: this.#v3Secret
    })

    if (success) {
      return true
    }

    // Fallback to v2

    success = await this._checkCode({
      token,
      secret: this.#v2Secret
    })

    if (!success && throwOnError) {
      throw new Error("Recaptcha verification failed")
    }

    return success
  }

  static symbol = Symbol("RecatpchaComponent")
}

container.registerSingleton(RecatpchaComponent.symbol, RecatpchaComponent)
