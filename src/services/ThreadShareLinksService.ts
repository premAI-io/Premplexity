import BaseService from "$services/BaseService"
import { ThreadShareLink, threadShareLinks as threadShareLinksTable } from "$db_schemas/threadShareLinks"
import DrizzleDB from "$components/DrizzleDB"
import { inject, container, injectable } from "tsyringe"
import ThreadsService, { ThreadComplete, WithMessages } from "$services/ThreadsService"
import { asc, eq, inArray } from "drizzle-orm"
import ThreadShareLinkMessagesService from "$services/ThreadShareLinkMessagesService"
import ThreadMessagesService from "$services/ThreadMessagesService"
import THREAD_MESSAGE_STATUS from "$types/THREAD_MESSAGE_STATUS"

export type WithThread<T> = T & {
  originalThread: ThreadComplete
}

export type ThreadShareLinkComplete = WithMessages<WithThread<ThreadShareLink>>

@injectable()
export default class ThreadShareLinksService extends BaseService<typeof threadShareLinksTable, ThreadShareLinkComplete, number> {
  mainTable = threadShareLinksTable
  pk = threadShareLinksTable.id

  constructor(
    @inject(DrizzleDB.token)
    private drizzleDB: DrizzleDB,
    @inject(ThreadsService.token)
    private threadsService: ThreadsService,
    @inject(ThreadShareLinkMessagesService.token)
    private threadShareLinkMessagesService: ThreadShareLinkMessagesService,
    @inject(ThreadMessagesService.token)
    private threadMessagesService: ThreadMessagesService,
  ) {
    super(drizzleDB)
  }

  _injectThreads = async <T extends ThreadShareLink>(threadShareLinks: T[]): Promise<WithThread<T>[]> => {
    const threadsIds = threadShareLinks.map(tsl => tsl.threadId)

    const threads = await this.threadsService.list({
      where: inArray(this.threadsService.mainTable.id, threadsIds),
    })

    return threadShareLinks.map(tsl => ({
      ...tsl,
      originalThread: threads.find(thread => thread.id === tsl.threadId)!
    }))
  }

  _injectMessages = async <T extends ThreadShareLink>(threadShareLinks: T[]): Promise<WithMessages<T>[]> => {
    const threadShareLinkIds = threadShareLinks.map(tsl => tsl.id)

    // Get all thread messages ids for the thread share links
    const theadMessagesTh = await this.threadShareLinkMessagesService.list({
      where: inArray(this.threadShareLinkMessagesService.mainTable.threadShareLinkId, threadShareLinkIds),
    })

    // Get all thread messages for the thread share links
    const messages = await this.threadMessagesService.list({
      where: inArray(this.threadMessagesService.mainTable.id, theadMessagesTh.map(e => e.id)),
      orderBy: [asc(this.threadMessagesService.mainTable.order)]
    })

    return threadShareLinks.map(tsl => {
      // Get all thread messages ids for the specific thread share link
      const threadShareLinkMessagesIds = theadMessagesTh.filter(e => e.threadShareLinkId === tsl.id).map(e => e.id)

      // Get all thread messages for the specific thread share link
      const tslMessages = messages.filter(m => threadShareLinkMessagesIds.includes(m.id))

      return {
        ...tsl,
        messages: ThreadMessagesService.formatMessages(tslMessages)
      }
    })
  }

  getByCode = async (code: string): Promise<ThreadShareLinkComplete | null> => {
    const [threadShareLink] = await this.list({
      where: eq(this.mainTable.code, code),
      skipBaseWhere: true
    })

    if (!threadShareLink) {
      return null
    }

    return threadShareLink
  }

  _generateUniqueCode = async (): Promise<string> => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const code = Math.random().toString(36).slice(2)
      const threadShareLink = await this.getByCode(code)

      if (threadShareLink === null) {
        return code
      }
    }
  }

  create = async (threadId: number): Promise<ThreadShareLinkComplete> => {
    const code = await this._generateUniqueCode()
    const thread = await this.threadsService.getOrFail(threadId)

    const threadShareLink = await this._insert({
      threadId,
      code,
    })

    // Insert all thread messages that are completed from the original thread.
    // Only the current message is inserted, not the previous ones (history)
    await this.threadShareLinkMessagesService.insert(
      thread.messages.filter(m => m.currentMessage.status === THREAD_MESSAGE_STATUS.COMPLETED).map(m => ({
        threadMessageId: m.currentMessage.id,
        threadShareLinkId: threadShareLink.id
      }))
    )

    return threadShareLink
  }

  delete = async (id: number): Promise<void> => {
    // Delete all thread share link messages
    await this.drizzle
      .delete(this.threadShareLinkMessagesService.mainTable)
      .where(eq(this.threadShareLinkMessagesService.mainTable.threadShareLinkId, id))

    // Delete the thread share link
    await this.drizzle
      .delete(this.mainTable)
      .where(eq(this.mainTable.id, id))
  }

  postProcess = async (threadShareLinks: ThreadShareLink[]): Promise<ThreadShareLinkComplete[]> => {
    return Promise.resolve(threadShareLinks)
      .then(this._injectThreads)
      .then(this._injectMessages)
  }

  static token = Symbol("ThreadShareLinksService")
}

container.register(ThreadShareLinksService.token, ThreadShareLinksService)
