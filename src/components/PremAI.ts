import Configs from "$components/Configs"
import { SelectOption } from "$templates/components/SelectSearchable"
import { DISABLED_MODELS } from "$types/MODELS"
import Prem from "@premai/prem-sdk"
import { AxiosError } from "axios"
import { container, inject, singleton } from "tsyringe"

import Openai from "openai"
import { ChatCompletionMessageParam } from "openai/resources/index.mjs"

@singleton()
export default class PremAI {
  readonly client: Prem
  readonly defaultChatModel: string
  readonly openai: Openai

  constructor(
    @inject(Configs.token)
    configs: Configs
  ) {
    this.client = new Prem({
      apiKey: configs.env.PREM_API_KEY
    })

    this.openai = new Openai({
      apiKey: configs.env.OPENAI_KEY
    })

    this.defaultChatModel = configs.env.DEFAULT_CHAT_MODEL
  }

  completion = async<T extends boolean>({
    client = "PREM",
    ...options
  }: {
    client?: "OPENAI" | "PREM",
    messages: {
      role: "user" | "assistant"
      content?: string
    }[],
    model?: string,
    projectId: number,
    systemPrompt?: string
    stream?: T
  }) => {
    if (client === "PREM") {
      return this.completionPrem<T>(options)
    }

    return this.completionOpenai(options) as unknown as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any
      error: string | null
      completeError: string | null
    }
  }

  completionPrem = async <T extends boolean>({
    messages,
    model = "gpt-3.5-turbo",
    projectId,
    systemPrompt,
    stream = false as T
  }: {
    messages: {
      role: "user" | "assistant"
      content?: string
    }[],
    model?: string,
    projectId: number,
    systemPrompt?: string
    stream?: T
  }) => {
    try {
      const data = await this.client.chat.completions.create({
        project_id: projectId,
        messages: messages,
        stream: stream,
        model,
        system_prompt: systemPrompt
      })

      return {
        data,
        error: null,
        completeError: null
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        return {
          error: err.response?.status + " | " + err.response?.data,
          data: null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          completeError: err.toString()
        }
      } else {
        let completeError: string | null = null

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((err as any)._outBuffer instanceof Buffer) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          completeError = (err as any)._outBuffer.toString("utf-8").replace(/\0/g, "")
          if (completeError) {
            const jsonIndex = completeError.indexOf("}") + 1
            completeError = completeError.substring(0, jsonIndex)
          }
        }

        return {
          error: "Generic error occurred",
          data: null,
          completeError
        }
      }
    }
  }

  completionOpenai = async <T extends boolean>({
    messages,
    model = "gpt-3.5-turbo",
    projectId,
    systemPrompt,
    stream = false as T
  }: {
    messages: {
      role: "user" | "assistant"
      content?: string
    }[],
    model?: string,
    projectId: number,
    systemPrompt?: string
    stream?: T
  }) => {
    try {
      const data = await this.openai.chat.completions.create({
        messages: [
          ...systemPrompt ? [{
            role: "system" as const,
            content: systemPrompt
          }] : [],
          ...messages as ChatCompletionMessageParam[]
        ],
        stream,
        model: "gpt-4o-mini"
      })

      return {
        data,
        error: null,
        completeError: null
      }
    } catch (err) {
      return {
        error: "Generic error occurred",
        data: null,
        completeError: "Generic error occurred"
      }
    }
  }

  getAvailableModels = async (selected?: string) => {
    return (
      await this.client.models.list()
    ).filter(({ deprecated, name, model_type }) => (
      !deprecated && !DISABLED_MODELS.includes(name) &&
      model_type === "text2text"
    )).map(({ name, model_provider }) => ({
      label: name,
      value: name,
      selected: selected ? name === selected : name === this.defaultChatModel,
      provider: model_provider ?? "Others"
    })).reduce((acc, { label, value, selected, provider }) => {
      if (!acc[provider]) {
        acc[provider] = []
      }

      acc[provider].push({ label, value, selected })
      return acc
    }, {} as Record<string, SelectOption[]>)
  }


  static token = Symbol("PremAI")
}

container.registerSingleton(PremAI.token, PremAI)
