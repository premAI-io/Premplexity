import { schemas } from "$routers/website/actionsRouter/thread/schemas"
import { ROUTE } from "$routers/website/actionsRouter/thread/types"
import { createRouter, getHtmxBrowserUrl } from "../../utils"
import ThreadsService, { ThreadComplete } from "$services/ThreadsService"
import { container } from "tsyringe"
import Sidebar from "$templates/components/Sidebar"
import ThreadCore from "$components/ThreadCore"
import WEB_SEARCH_ENGINE, { WEB_SEARCH_ENGINE_OPTIONS } from "$types/WEB_SEARCH_ENGINE"
import ThreadPage from "$templates/components/thread/ThreadPage"
import PremAI from "$components/PremAI"
import WebappSSEManager from "$components/WebappSSEManager"
import SOURCE_ENGINE_TYPE from "$types/SOURCE_ENGINE_TYPE"
import UserMessage from "$templates/components/thread/UserMessage"
import SourcesSection from "$templates/components/thread/SourcesSection"
import TextSection from "$templates/components/thread/TextSection"
import { ThreadMessageComplete } from "$services/ThreadMessagesService"
import History from "$templates/components/mobile/History"
import ShareModal from "$templates/components/ShareModal"
import Configs from "$components/Configs"
import ThreadShareLinksService from "$services/ThreadShareLinksService"

export const routerPrefix = "/thread"

export const router = createRouter((server) => {

  const sseComponent = container.resolve<WebappSSEManager>(WebappSSEManager.token)
  const threadCoreService = container.resolve<ThreadCore>(ThreadCore.token)
  const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
  const configs = container.resolve<Configs>(Configs.token)
  const threadShareLinksService = container.resolve<ThreadShareLinksService>(ThreadShareLinksService.token)

  const searchHandler = ({ query, model, thread, searchEngine, currentMessage, client }: {
    query: string
    model: string
    thread: ThreadComplete
    searchEngine: WEB_SEARCH_ENGINE
    currentMessage?: ThreadMessageComplete,
    client: "PREM"
  }) => {
    threadCoreService.search({
      client,
      query,
      model,
      thread,
      sourceEngineType: SOURCE_ENGINE_TYPE.WEB,
      searchEngine,
      maxResults: 10,
      cb: async (data) => {
        sseComponent.SSEManager.broadcast(
          WebappSSEManager.getUserRoomId(thread.userId),
          {
            data: JSON.stringify({
              content: data,
              threadId: thread.id
            })
          }
        )
      },
      ...currentMessage ? { currentMessage } : {}
    })
  }

  server.post(ROUTE.CREATE, {
    schema: schemas[ROUTE.CREATE]
  }, async (req, res) => {
    const { model, searchEngine, message: bodyMessage, inputPrompt } = req.body
    const userId = req.callerUser.id
    const message = inputPrompt.length ? inputPrompt : bodyMessage

    if (!message || message.length === 0) {
      return res.status(400).send("Message is required")
    }

    let thread = await threadsService.createThread({
      userId,
      message
    })

    searchHandler({
      query: message,
      model,
      thread,
      searchEngine: searchEngine as WEB_SEARCH_ENGINE,
      client: req.body.client
    })

    const threadsList = await threadsService.getThreadsGroupedByDate(userId)

    const premAI = container.resolve<PremAI>(PremAI.token)
    const availableModels = await premAI.getAvailableModels(model)

    thread = await threadsService.getOrFail(thread.id)

    const client = req.body.client

    return res
      .headers({
        "HX-Replace-Url": `/thread/${thread.id}?client=${client}`,
        "HX-Reswap": "none"
      })
      .view(
        <>
          <Sidebar
            activeThreadId={thread.id}
            threadsList={threadsList}
            swapOOB="outerHTML"
            active="chat"
          />
          <ThreadPage
            swapOOB="outerHTML"
            thread={thread}
            availableModels={availableModels}
            availableSources={WEB_SEARCH_ENGINE_OPTIONS(searchEngine)}
            loading={true}
            githubUrl={req.globalResources.GITHUB_REPO_URL}
            // message insertion could take time, so we show a skeleton message
            {...thread.messages.length === 0 ? {
              skeletonMessages: {
                content: message,
                assistantModel: model,
                webSearchEngineType: searchEngine
              }
            } : {}
            }
          />
        </>
      )
  })

  server.post(ROUTE.DELETE, {
    schema: schemas[ROUTE.DELETE]
  }, async (req, res) => {
    const { targetThreadId } = req.params
    const userId = req.callerUser.id
    await threadsService.deleteThread(userId, targetThreadId)

    const currentUrl = getHtmxBrowserUrl(req)
    if (currentUrl) {
      const { pathname } = currentUrl

      if (pathname.startsWith(routerPrefix)) {
        if (pathname !== `${routerPrefix}/${targetThreadId}`) {
          const threadsList = await threadsService.getThreadsGroupedByDate(userId)
          const activeThreadId = pathname.split("/").pop()

          return res
            .headers({
              "HX-Retarget": "#sidebar",
              "HX-Reswap": "outerHTML"
            })
            .view(
              <Sidebar
                activeThreadId={activeThreadId ? parseInt(activeThreadId) : undefined}
                threadsList={threadsList}
                active="chat"
              />
            )
        }
      } else if (pathname === "/history") {
        const threadsList = await threadsService.getThreadsGroupedByDate(userId)
        return res
          .headers({
            "HX-Retarget": "#sidebar,#history-list",
            "HX-Reswap": "none"
          })
          .view(
            <>
              <Sidebar
                threadsList={threadsList}
                active="chat"
                swapOOB="outerHTML"
                withMobileNavbar={false}
              />
              <History
                threadsList={threadsList}
                swapOOB="outerHTML"
              />
            </>
          )
      }
    }

    return res.redirect("/")
  })

  server.post(ROUTE.SEND_MESSAGE, {
    schema: schemas[ROUTE.SEND_MESSAGE]
  }, async (req, res) => {
    const { model, searchEngine, message: bodyMessage, inputPrompt } = req.body
    const message = inputPrompt.length ? inputPrompt : bodyMessage
    const threadId = req.params.targetThreadId

    if (!message || message.length === 0) {
      return res.status(400).send("Message is required")
    }

    const thread = await threadsService.getOrFail(threadId)

    if (thread.userId !== req.callerUser.id) {
      return res.status(403).send("Forbidden")
    }

    searchHandler({
      query: message,
      model,
      thread,
      searchEngine: searchEngine as WEB_SEARCH_ENGINE,
      client: req.body.client
    })

    return res.view(
      <div id={"last-message"}>
        <UserMessage content={message} editable threadId={thread.id} />
        <SourcesSection
          webSearchEngineType={searchEngine}
          sources={[]}
          loading={true}
          isCurrentMessage={true}
          threadId={thread.id}
          messageId={0}
          lastMessage
        />
        <TextSection
          threadId={thread.id}
          assistantModel={model}
          assistantError={null}
          assistantResponse={null}
          loading={true}
          isCurrentMessage={true}
          lastMessage
          messageId={0}
        />
      </div>
    )
  })

  server.post(ROUTE.RETRY, {
    schema: schemas[ROUTE.RETRY]
  }, async (req, res) => {
    const { targetThreadId } = req.params
    const thread = await threadsService.getOrFail(targetThreadId)

    if (thread.userId !== req.callerUser.id) {
      return res.status(403).send("Forbidden")
    }

    const lastMessage = thread.messages.slice(-1)[0]
    if (!lastMessage) {
      return res.status(400).send("No messages in thread")
    }

    const model = req.body.model ?? lastMessage.currentMessage.assistantModel
    const searchEngine = (req.body.searchEngine ?? lastMessage.currentMessage.webSearchEngineType) as WEB_SEARCH_ENGINE

    searchHandler({
      query: lastMessage.currentMessage.userQuery,
      model,
      thread,
      searchEngine,
      client: req.body.client
    })

    return res.view(
      <>
        <UserMessage content={lastMessage.currentMessage.userQuery} editable threadId={thread.id} />
        <SourcesSection
          webSearchEngineType={searchEngine}
          sources={[]}
          loading={true}
          isCurrentMessage={true}
          threadId={thread.id}
          messageId={0}
          lastMessage
        />
        <TextSection
          threadId={thread.id}
          assistantModel={model}
          assistantError={null}
          assistantResponse={null}
          loading={true}
          isCurrentMessage={true}
          lastMessage
          messageId={0}
        />
      </>
    )
  })

  server.post(ROUTE.EDIT_MESSAGE, {
    schema: schemas[ROUTE.EDIT_MESSAGE]
  }, async (req, res) => {
    const { targetThreadId } = req.params
    const { message } = req.query
    const thread = await threadsService.getOrFail(targetThreadId)

    if (thread.userId !== req.callerUser.id) {
      return res.status(403).send("Forbidden")
    }

    const lastMessage = thread.messages.slice(-1)[0]
    if (!lastMessage) {
      return res.status(400).send("No messages in thread")
    }

    const model = req.query.model ?? lastMessage.currentMessage.assistantModel
    const searchEngine = (req.query.searchEngine ?? lastMessage.currentMessage.webSearchEngineType) as WEB_SEARCH_ENGINE

    searchHandler({
      query: message,
      model,
      thread,
      searchEngine,
      currentMessage: lastMessage.currentMessage,
      client: req.query.client
    })

    return res.view(
      <>
        <UserMessage content={message} editable threadId={thread.id} />
        <SourcesSection
          webSearchEngineType={searchEngine}
          sources={[]}
          loading={true}
          isCurrentMessage={true}
          threadId={thread.id}
          messageId={0}
          lastMessage
        />
        <TextSection
          threadId={thread.id}
          assistantModel={model}
          assistantError={null}
          assistantResponse={null}
          loading={true}
          isCurrentMessage={true}
          lastMessage
          messageId={0}
        />
      </>
    )
  })

  server.get(ROUTE.SHARE, {
    schema: schemas[ROUTE.SHARE]
  }, async (req, res) => {
    const { targetThreadId } = req.params
    const thread = await threadsService.getOrFail(targetThreadId)

    if (thread.userId !== req.callerUser.id) {
      return res.status(403).send("Forbidden")
    }

    const snapshot = await threadShareLinksService.create(targetThreadId)
    const baseUrl = configs.env.APP_BASE_URL

    return res
      .headers({
        "HX-Retarget": "#modal",
        "HX-Reswap": "innerHTML"
      })
      .view(
        <ShareModal
          snapshot={snapshot}
          baseUrl={baseUrl}
        />
      )
  })
})
