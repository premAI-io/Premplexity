import Configs from "$components/Configs"
import { SelectOption } from "$templates/components/SelectSearchable"
import { DISABLED_MODELS } from "$types/MODELS"
import OpenAI from "openai"
import { container, inject, singleton } from "tsyringe"


@singleton()
export default class PremAI {
  private openai: OpenAI
  private defaultChatModel: string

  constructor(
    @inject(Configs.token)
    private configs: Configs
  ) {
    const baseURL = this.configs.env.PREM_AI_BASE_URL
    this.openai = new OpenAI({
      baseURL,
      apiKey: this.configs.env.PREM_API_KEY
    })
    this.defaultChatModel = "gpt-4o-mini"
  }

  completion = () => this.openai.chat.completions

  getAvailableModels = async (selected?: string) => {
    const r = await this.openai.models.list({ "path": `${this.configs.env.PREM_AI_BASE_URL}/chat/models` })
    return r.data.filter(({ id: name }) => (
      !DISABLED_MODELS.includes(name)
    )).map(({ id: name, owned_by: model_provider }) => ({
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

  static token = Symbol("PremClient")
}

container.registerSingleton(PremAI.token, PremAI)
