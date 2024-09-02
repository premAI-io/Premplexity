import BaseService from "$services/BaseService"
import { Thread, threads as threadsTable } from "$db_schemas/threads"
import DrizzleDB from "$components/DrizzleDB"
import { inject, container, injectable } from "tsyringe"
import { ThreadMessageComplete } from "$services/ThreadMessagesService"
import ThreadMessagesService from "$services/ThreadMessagesService"
import UsersService, { CompleteUser } from "$services/UsersService"
import { inArray, asc, eq, desc, and } from "drizzle-orm"
import THREAD_MESSAGE_STATUS from "$types/THREAD_MESSAGE_STATUS"
import THREAD_STATUS from "$types/THREAD_STATUS"
import { ThreadListItem } from "$templates/views/NewThreadView"

export type WithMessages<T> = T & {
  messages: {
    currentMessage: ThreadMessageComplete,
    history: ThreadMessageComplete[]
  }[]
}

export type WithUser<T> = T & {
  user: CompleteUser
}

export type WithStatus<T> = T & {
  status: THREAD_STATUS
}


export type ThreadComplete = WithStatus<WithUser<WithMessages<Thread>>>

@injectable()
export default class ThreadsService extends BaseService<typeof threadsTable, ThreadComplete, number> {
  mainTable = threadsTable
  pk = threadsTable.id

  constructor(
    @inject(DrizzleDB.token)
    private drizzleDB: DrizzleDB,
    @inject(ThreadMessagesService)
    private threadMessagesService: ThreadMessagesService,
    @inject(UsersService)
    private usersService: UsersService
  ) {
    super(drizzleDB)
  }

  _injectMessages = async <T extends Thread>(threads: T[]): Promise<WithMessages<T>[]> => {
    const threadsIds = threads.map(thread => thread.id)

    const messages = await this.threadMessagesService.list({
      where: inArray(this.threadMessagesService.mainTable.threadId, threadsIds),
      orderBy: [asc(this.threadMessagesService.mainTable.order)]
    })

    return threads.map(thread => {
      const threadMessages = messages.filter(message => message.threadId === thread.id)

      return {
        ...thread,
        messages: ThreadMessagesService.formatMessages(threadMessages)
      }
    })
  }

  _injectUsers = async <T extends Thread>(threads: T[]): Promise<WithUser<T>[]> => {
    const usersIds = threads.map(thread => thread.userId)

    const users = await this.usersService.list({
      where: inArray(this.usersService.mainTable.id, usersIds),
    })

    return threads.map(thread => ({
      ...thread,
      user: users.find(u => u.id === thread.userId)!
    }))
  }

  _injectStatus = async <T extends WithMessages<Thread>>(threads: T[]): Promise<WithStatus<T>[]> => {
    return threads.map(thread => {
      const lastMessage = thread.messages[0]?.currentMessage

      const mapping = {
        [THREAD_MESSAGE_STATUS.COMPLETED]: THREAD_STATUS.READY,
        [THREAD_MESSAGE_STATUS.FAILED]: THREAD_STATUS.READY,
        [THREAD_MESSAGE_STATUS.PENDING]: THREAD_STATUS.PROCESSING
      }


      return {
        ...thread,
        status: mapping[lastMessage?.status] || THREAD_STATUS.READY
      }
    })
  }

  createThread = async (options: {
    userId: number,
    message: string
  }): Promise<ThreadComplete> => {
    const thread = await this.insert({
      userId: options.userId,
      title: options.message.length > 50 ? options.message.slice(0, 47) + "..." : options.message,
      creationTimestamp: new Date().toISOString()
    })

    return thread
  }

  getThreadsGroupedByDate = async (userId: number): Promise<ThreadListItem[]> => {
    const threads = await this.list({
      where: and(
        eq(this.mainTable.userId, userId),
        eq(this.mainTable.deleted, false)
      ),
      orderBy: [desc(this.mainTable.creationTimestamp)]
    })

    const todayThreads = threads.filter(thread => {
      return new Date(thread.creationTimestamp as string).getTime() > new Date().setHours(0, 0, 0, 0)
    })
    const yesterdayThreads = threads.filter(thread => {
      return (
        new Date(thread.creationTimestamp as string).getTime() < new Date().setHours(0, 0, 0, 0) &&
        new Date(thread.creationTimestamp as string).getTime() > new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000
      )
    })
    const lastWeekThreads = threads.filter(thread => {
      return (
        new Date(thread.creationTimestamp as string).getTime() < new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000 &&
        new Date(thread.creationTimestamp as string).getTime() > new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000
      )
    })
    const lastMonthThreads = threads.filter(thread => {
      return (
        new Date(thread.creationTimestamp as string).getTime() < new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000 &&
        new Date(thread.creationTimestamp as string).getTime() > new Date().setHours(0, 0, 0, 0) - 30 * 24 * 60 * 60 * 1000
      )
    })
    const olderThreads = threads.filter(thread => {
      return (
        new Date(thread.creationTimestamp as string).getTime() < new Date().setHours(0, 0, 0, 0) - 30 * 24 * 60 * 60 * 1000
      )
    })

    return [
      {
        time: "Today",
        threads: todayThreads
      },
      {
        time: "Yesterday",
        threads: yesterdayThreads
      },
      {
        time: "Last week",
        threads: lastWeekThreads
      },
      {
        time: "Last month",
        threads: lastMonthThreads
      },
      {
        time: "Older",
        threads: olderThreads
      }
    ]
  }

  deleteThread = async (userId: number, threadId: number): Promise<void> => {
    const thread = await this.get(threadId)

    if (!thread || thread.userId !== userId) {
      return
    }

    await this.update(threadId, {
      deleted: true
    })
  }

  postProcess = async (threads: Thread[]): Promise<ThreadComplete[]> => {
    return Promise.resolve(threads)
      .then(this._injectMessages)
      .then(this._injectUsers)
      .then(this._injectStatus)
  }

  insert = this._insert

  static token = Symbol("ThreadsService")
}

container.register(ThreadsService.token, ThreadsService)
