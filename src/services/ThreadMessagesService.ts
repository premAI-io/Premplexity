import BaseService from "$services/BaseService"
import {
  ThreadMessage,
  threadMessages as threadMessagesTable,
} from "$db_schemas/threadMessages"
import DrizzleDB from "$components/DrizzleDB"
import Configs from "$components/Configs"
import { inject, container, injectable } from "tsyringe"
import THREAD_MESSAGE_STATUS from "$types/THREAD_MESSAGE_STATUS"
import ThreadMessageSourcesService, { ImageThreadMessageSourcesServiceComplete, WebPageThreadMessageSourcesServiceComplete } from "$services/ThreadMessageSourcesService"
import ThreadShareLinkMessagesService from "$services/ThreadShareLinkMessagesService"
import { inArray } from "drizzle-orm"
import SOURCE_TYPE from "$types/SOURCE_TYPE"

export type WithStatus<T> = T & ({
  status: THREAD_MESSAGE_STATUS.COMPLETED,
  assistantError: null,
  assistantResponse: string,
  assistantTimestamp: string
} | {
  status: THREAD_MESSAGE_STATUS.FAILED,
  assistantError: string,
  assistantResponse: null,
  assistantTimestamp: string
} | {
  status: THREAD_MESSAGE_STATUS.PENDING,
  assistantError: null,
  assistantResponse: null,
  assistantTimestamp: null
})

export type WithSources<T> = T & {
  sources: {
    images: ImageThreadMessageSourcesServiceComplete[],
    pages: WebPageThreadMessageSourcesServiceComplete[]
  }
}

export type ThreadMessageComplete = WithSources<ThreadMessage> & { status: THREAD_MESSAGE_STATUS }



@injectable()
export default class ThreadMessagesService extends BaseService<
  typeof threadMessagesTable,
  ThreadMessageComplete,
  number
> {
  mainTable = threadMessagesTable
  pk = threadMessagesTable.id
  baseOrderBy = [this.mainTable.userTimestamp]

  constructor(
    @inject(DrizzleDB.token)
    private drizzleDB: DrizzleDB,
    @inject(Configs.token)
    private configs: Configs,
    @inject(ThreadShareLinkMessagesService.token)
    private threadShareLinkMessagesService: ThreadShareLinkMessagesService,
    @inject(ThreadMessageSourcesService.token)
    private threadMessageSourcesService: ThreadMessageSourcesService
  ) {
    super(drizzleDB)
  }

  _injectStatus = async <T extends ThreadMessage>(
    messages: T[]
  ): Promise<WithStatus<T>[]> => {
    return messages.map((message) => {
      let status
      let assistantError = null
      let assistantResponse = null
      let assistantTimestamp = null

      const messageTime = new Date(message.userTimestamp).getTime()

      if (message.assistantResponse) {
        status = THREAD_MESSAGE_STATUS.COMPLETED
        assistantResponse = message.assistantResponse
        assistantTimestamp = message.assistantTimestamp
      } else if (message.assistantError) {
        status = THREAD_MESSAGE_STATUS.FAILED
        assistantError = message.assistantError.toString()
        assistantTimestamp = message.assistantTimestamp
      } else if (Date.now() - messageTime > this.configs.env.CHAT_MESSAGE_TIMEOUT) {
        status = THREAD_MESSAGE_STATUS.FAILED
        assistantError = "timeout"
      } else {
        status = THREAD_MESSAGE_STATUS.PENDING
      }

      return {
        ...message,
        status,
        assistantError,
        assistantResponse,
        assistantTimestamp,
      } as WithStatus<T>
    })
  }

  _injectSources = async <T extends ThreadMessage>(messages: T[]): Promise<WithSources<T>[]> => {
    const threadMessageIds = messages.map((m) => m.id)

    const sources = await this.threadMessageSourcesService.list({
      where: inArray(this.threadMessageSourcesService.mainTable.threadMessageId, threadMessageIds)
    })

    return messages.map((message) => ({
      ...message,
      sources: {
        images: sources.filter((s) => s.threadMessageId === message.id && s.type === SOURCE_TYPE.IMAGE) as ImageThreadMessageSourcesServiceComplete[],
        pages: sources.filter((s) => s.threadMessageId === message.id && s.type === SOURCE_TYPE.WEB_PAGE) as WebPageThreadMessageSourcesServiceComplete[]
      }
    }))
  }

  postProcess = async (
    messages: ThreadMessage[]
  ): Promise<ThreadMessageComplete[]> => {
    return Promise.resolve(messages)
      .then(this._injectStatus)
      .then(this._injectSources)
  }

  insert = this._insert

  static formatMessages = (
    messages: ThreadMessageComplete[]
  ): {
    currentMessage: ThreadMessageComplete,
    history: ThreadMessageComplete[]
  }[] => {
    const messagesGroupedByOrder: {
      [key: string]: ThreadMessageComplete[]
    } = {}

    for (const message of messages) {
      const { order } = message

      if (!messagesGroupedByOrder[order]) {
        messagesGroupedByOrder[order] = []
      }

      messagesGroupedByOrder[order].push(message)
    }

    const orderedMessages = Object.values(messagesGroupedByOrder).sort((a, b) => a[0].order - b[0].order)
    return orderedMessages.map(history => ({
      history,
      currentMessage: history.sort((a, b) => new Date(a.userTimestamp).getTime() - new Date(b.userTimestamp).getTime()).slice(-1)[0]
    }))
  }

  static token = Symbol("ThreadMessagesService")
}

container.register(ThreadMessagesService.token, ThreadMessagesService)
