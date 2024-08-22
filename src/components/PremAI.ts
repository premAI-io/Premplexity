import Configs from "$components/Configs"
import Prem from "@premai/prem-sdk"
import { AxiosError } from "axios"
import { container, inject, singleton } from "tsyringe"


@singleton()
export default class PremAI {
  readonly client: Prem
  readonly defaultChatModel: string

  constructor(
    @inject(Configs.token)
    configs: Configs
  ) {
    this.client = new Prem({
      apiKey: configs.env.PREM_API_KEY
    })

    this.defaultChatModel = configs.env.DEFAULT_CHAT_MODEL
  }

  completion = async <T extends boolean>({
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
        error: null
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        return {
          error: err.response?.status + " | " + err.response?.data,
          data: null
        }
      } else {
        return {
          error: (err as Error).toString(),
          data: null
        }
      }
    }
  }

  getAvailableModels = async (selected?: string) => {
    return (
      await this.client.models.list()
    ).filter(({ deprecated, name, model_type }) => (
      !deprecated && name !== "Autopilot" &&
      model_type === "text2text"
    )).map(({ name }) => ({
      label: name,
      value: name,
      selected: selected ? name === selected : name === this.defaultChatModel
    }))
  }


  static token = Symbol("PremAI")
}

container.registerSingleton(PremAI.token, PremAI)
