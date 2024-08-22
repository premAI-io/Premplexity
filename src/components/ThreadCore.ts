import SerpAPI, { SearchResults } from "$components/SerpAPI"
import { container, inject, singleton } from "tsyringe"
import ThreadsService, { ThreadComplete } from "$services/ThreadsService"
import ThreadMessagesService from "$services/ThreadMessagesService"
import PremAI from "$components/PremAI"
import Configs from "$components/Configs"
import WEB_SEARCH_ENGINE from "$types/WEB_SEARCH_ENGINE"
import SOURCE_ENGINE_TYPE from "$types/SOURCE_ENGINE_TYPE"
import THREAD_STATUS from "$types/THREAD_STATUS"
import THREAD_MESSAGE_STATUS from "$types/THREAD_MESSAGE_STATUS"
import ThreadMessageSourcesService from "$services/ThreadMessageSourcesService"
import SOURCE_TYPE from "$types/SOURCE_TYPE"

export type EndCallbackData = {
  sources:
  | {
    searchSources: SearchResults
  }
  | {
    ragSources: null // TODO v2
  },
  content: string | null,
  error: string | null,
  improvedQuery?: string,
  followUpQuestions?: string[]
}

export type SearchCallbackParams = {
  type: "searchSources"
  data: SearchResults
} | {
  type: "improvedQuery"
  data: string
} | {
  type: "completionChunk"
  data: string
} | {
  type: "followUpQuestions"
  data: string[]
} | {
  type: "end"
  data: EndCallbackData
}

export type SearchCallback = (
  params: SearchCallbackParams
) => void

export type AssistantHistoryMessage = {
  role: "user" | "assistant"
  content: string
}

@singleton()
export default class ThreadCore {
  constructor(
    @inject(SerpAPI.token)
    private serpAPI: SerpAPI,

    @inject(PremAI.token)
    private premAI: PremAI,

    @inject(ThreadsService.token)
    private threadsService: ThreadsService,

    @inject(ThreadMessagesService.token)
    private threadMessagesService: ThreadMessagesService,

    @inject(Configs.token)
    private configs: Configs,

    @inject(ThreadMessageSourcesService.token)
    private threadMessageSourcesService: ThreadMessageSourcesService
  ) {
  }

  _improveQuerySystemPrompt = (params: {
    searchEngine: string,
    previousContext: string
  }) => `
You are an AI tasked with improving search queries. Follow these guidelines:
- Enhance the search query by providing a more detailed description of what the user is looking for.
- Keep in mind that the search engine is ${params.searchEngine}.
- You will receive the entire conversation between the user and the assistant, but only the last user message is the actual query.
- Reply ONLY with the improved query in the same language used by the user.
- Ensure the improved query is specific and unambiguous.
- Avoid adding unnecessary information or altering the original intent of the query.
- Maintain user confidentiality and do not include personal data.
- Ensure the improved query is contextually relevant based on the conversation history.
- Use synonyms or related terms to make the query more comprehensive.
- Consider possible intents behind the query to provide a more thorough description.
- Avoid technical jargon unless the user specifically uses such language.
- Check for and correct any grammatical or typographical errors in the query.
- You MUST respond with a fully self-contained question, including all necessary details, as your response will be directly used in ${params.searchEngine} search engine query without any additional context.

------ PREVIOUS CONVERSATION FOR CONTEXT PURPOSE --------

${params.previousContext}
`

  _searchSystemPrompt = (params: {
    model: string,
    search?: {
      engine: string,
      results: string
    }
  }) => `
You are an expert search engine LLM powered by PREM AI.
The current model in use is ${params.model}.
Today is ${new Date().toDateString()}.
You are given a search query and must provide the best search results.

You MUST:
- Be precise and concise.
- Use credible and reliable sources only.
- Provide answers based on the most recent information available.
- Summarize content accurately without altering its meaning.
- Use clear and straightforward language.
- Use the same language as the user.
- Do not mention the search engine or the source links
- At the end of each sentence, only if a source is used, provide a reference to the source. Use the following format: <a href={sourceLink} target="_blank" class="source">{number in 'order' prop of source}</a>

Source example format: ... sentence ... <a href="https://www.example.com" target="_blank" class="source"> 1 </a>.

You MUST NOT:
- Invent information.
- Provide your opinion.
- Use more than three references per answer.
- Include redundant or irrelevant information.
- Include any personal data or sensitive information.
- Use informal language or slang.

Ensure the accuracy and relevance of the search results.
Adhere to ethical guidelines and maintain user confidentiality.

${params.search && `
  --- Search Results from ${params.search.engine} ---
  ${params.search.results}
`}

`

  _followUpSystemPrompt = (params: {
    n: number,
    context: string
  }) => `
You are an AI tasked with providing follow-up questions. Follow these guidelines:
- Ask questions that are relevant to the user's query.
- Use the conversation history to generate contextually appropriate questions.
- Ensure that the questions are clear and concise.
- Avoid asking questions that have already been answered.
- Do not ask personal or sensitive questions.
- Use the same language as the user.
- Each follow-up question should be unique and not repetitive.
- Each follow-up question should be self-contained and not rely on previous questions for context.
- You MUST respond with ${params.n} follow-up questions
- Respond ONLY with the follow-up questions, one per line

------ PREVIOUS CONVERSATION FOR CONTEXT PURPOSE --------
${params.context}

`

  private improveQuery = async(params: {
    query: string,
    searchEngine: string,
    previousMessages: AssistantHistoryMessage[]
  }) => {
    const {
      error,
      data
    } = await this.premAI.completion({
      projectId: this.configs.env.PREM_PROJECT_ID,
      stream: false,
      messages: [
        {
          role: "user",
          content: params.query,
        },
      ],
      systemPrompt: this._improveQuerySystemPrompt({
        searchEngine: params.searchEngine,
        previousContext: JSON.stringify(params.previousMessages)
      }),
      model: this.configs.env.QUERY_ENHANCER_MODEL,
    })

    return {
      error,
      data: data?.choices[0].message.content
    }
  }

  static formatMessages = (messages: ThreadComplete["messages"]): AssistantHistoryMessage[] => {
    return messages
      .filter((message) => message.currentMessage.status === THREAD_MESSAGE_STATUS.COMPLETED)
      .map((message) => [
        {
          role: "user" as const,
          content: message.currentMessage.userImprovedQuery || message.currentMessage.userQuery,
        },
        {
          role: "assistant" as const,
          content: message.currentMessage.assistantResponse!,
        }
      ])
      .flat()
  }

  private generateFollowUpQuestions = async(params: {
    previousMessages: AssistantHistoryMessage[]
  }) => {
    const {
      error,
      data
    } = await this.premAI.completion({
      projectId: this.configs.env.PREM_PROJECT_ID,
      stream: false,
      messages: params.previousMessages,
      systemPrompt: this._followUpSystemPrompt({
        n: 5,
        context: JSON.stringify(params.previousMessages)
      }),
      model: this.configs.env.FOLLOW_UP_MODEL,
    })

    let parsed = null
    if (data) {
      try {
        parsed = data.choices[0].message.content!.split("\n").map((line) => line.trim())
      } catch (_) {
        return {
          error: "Failed to parse the follow-up questions",
          data: null
        }
      }

      if (!Array.isArray(parsed)) {
        return {
          error: "The follow-up questions should be an array",
          data: null
        }
      }

      if (parsed.length === 0) {
        return {
          error: "The follow-up questions should not be empty",
          data: null
        }
      }
    }

    return {
      error,
      data: parsed
    }
  }

  public async search(
    params: {
      thread: ThreadComplete
      query: string
      maxResults?: number
      model: string
      cb?: SearchCallback
    } & (
        {
          sourceEngineType: SOURCE_ENGINE_TYPE.RAG,
        } | {
          sourceEngineType: SOURCE_ENGINE_TYPE.WEB,
          searchEngine: WEB_SEARCH_ENGINE
        }
      )
  ): Promise<EndCallbackData> {
    if (params.thread.status !== THREAD_STATUS.READY) {
      throw new Error("Thread is not in ready status")
    }

    const previousMessagesFormatted = ThreadCore.formatMessages(params.thread.messages)

    const message = await this.threadMessagesService.insert({
      sourceType: params.sourceEngineType,
      webSearchEngineType: params.sourceEngineType === SOURCE_ENGINE_TYPE.WEB ? params.searchEngine : undefined,
      threadId: params.thread.id,
      userQuery: params.query,
      assistantModel: params.model,
    })

    let improvedQuery: string | undefined
    let searchSources: SearchResults | undefined
    let systemPrompt = this._searchSystemPrompt({ model: params.model })

    // In case of web search, improve the query if the feature is enabled
    // This allow to make a more accurate search with the context of the conversation
    if (params.sourceEngineType === SOURCE_ENGINE_TYPE.WEB) {
      if (this.configs.env.ENHANCE_USER_QUERY) {
        const { data, error } = await this.improveQuery({
          query: params.query,
          searchEngine: params.searchEngine,
          previousMessages: previousMessagesFormatted
        })

        if (data) {
          improvedQuery = data

          await this.threadMessagesService.update(message.id, {
            userImprovedQuery: improvedQuery,
          })

          if (improvedQuery && params.cb) {
            params.cb({
              type: "improvedQuery",
              data: improvedQuery,
            })
          }
        } else if (error) {
          // TODO log the error, consider stopping the whole execution...
        }
      }

      searchSources = await this.serpAPI.search({
        query: improvedQuery || params.query,
        engine: params.searchEngine,
        max_results: params.maxResults,
      })

      // Save search pages as message sources
      if (searchSources.pages.length) {
        await this.threadMessageSourcesService.insert(
          searchSources.pages.map((page) => ({
            threadMessageId: message.id,
            type: SOURCE_TYPE.WEB_PAGE,
            order: page.order,
            title: page.title,
            link: page.link,
            snippet: page.snippet,
            favicon: page.favicon,
          }))
        )
      }

      // Save search images as message sources
      if (searchSources.images.length) {
        await this.threadMessageSourcesService.insert(
          searchSources.images.map((page) => ({
            threadMessageId: message.id,
            type: SOURCE_TYPE.IMAGE,
            order: page.order,
            title: page.title,
            link: page.link,
            image: page.image,
            thumbnail: page.thumbnail
          }))
        )
      }

      if (params.cb) {
        params?.cb({
          type: "searchSources",
          data: searchSources,
        })
      }

      // Update the system prompt with the search results
      systemPrompt = this._searchSystemPrompt({
        model: params.model,
        search: {
          engine: params.searchEngine,
          results: JSON.stringify(searchSources.pages, null, 2)
        }
      })
    }

    const { data, error } = await this.premAI.completion({
      projectId: this.configs.env.PREM_PROJECT_ID,
      stream: true,
      messages: [
        ...previousMessagesFormatted,
        {
          role: "user",
          content: params.query,
        },
      ],
      model: params.model,
      systemPrompt,
    })

    const out: EndCallbackData = {
      sources: searchSources
        ? {
          searchSources,
        }
        : {
          ragSources: null,
        },
      content: null,
      error: null,
      improvedQuery,
    }

    if (error) {
      out.error = error.toString()
    } else {
      let completion = ""

      for await (const chunk of data!) {
        const data = chunk.choices[0].delta.content
        if (data) {
          completion += data

          if (params.cb) {
            params.cb({
              type: "completionChunk",
              data
            })
          }
        }
      }

      out.content = completion
    }

    const { data: followUpData, error: followUpError } = await this.generateFollowUpQuestions({
      previousMessages: previousMessagesFormatted.concat([
        {
          role: "user",
          content: improvedQuery || params.query,
        },
        {
          role: "assistant",
          content: out.content!,
        }
      ])
    })

    if (followUpData) {
      out.followUpQuestions = followUpData

      await this.threadMessagesService.update(message.id, {
        followUpQuestions: followUpData,
      })

      if (params.cb) {
        params.cb({
          type: "followUpQuestions",
          data: followUpData,
        })
      }
    } else if (followUpError) {
      console.log("FOLLOW UP ERROR", followUpError)
      // TODO log the error, consider stopping the whole execution...
    }

    if (params.cb) {
      params.cb({
        type: "end",
        data: out,
      })
    }

    await this.threadMessagesService.update(message.id, {
      assistantResponse: out.content,
      assistantError: out.error?.toString(),
      assistantTimestamp: new Date().toISOString(),
    })

    return out
  }

  static token = Symbol("ThreadCore")
}

container.registerSingleton(ThreadCore.token, ThreadCore)
