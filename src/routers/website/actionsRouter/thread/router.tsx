import { schemas } from "$routers/website/actionsRouter/thread/schemas"
import { ROUTE } from "$routers/website/actionsRouter/thread/types"
import { createRouter } from "../../utils"
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
import ImagesSection from "$templates/components/thread/ImagesSection"
import TextSection from "$templates/components/thread/TextSection"

export const routerPrefix = "/thread"

export const router = createRouter((server) => {

  const sseComponent = container.resolve<WebappSSEManager>(WebappSSEManager.token)
  const threadCoreService = container.resolve<ThreadCore>(ThreadCore.token)

  const searchHandler = ({ query, model, thread, searchEngine }: {
    query: string
    model: string
    thread: ThreadComplete
    searchEngine: WEB_SEARCH_ENGINE
  }) => {
    threadCoreService.search({
      query,
      model,
      thread,
      sourceEngineType: SOURCE_ENGINE_TYPE.WEB,
      searchEngine,
      maxResults: 10,
      cb: async (data) => {
        sseComponent.SSEManager.broadcast(
          WebappSSEManager.getUserRoomId(thread.userId),
          { data: JSON.stringify({
            content: data,
            threadId: thread.id
          }) }
        )
      }
    })
  }

  server.post(ROUTE.CREATE, {
    schema: schemas[ROUTE.CREATE]
  }, async (req, res) => {
    const { model, searchEngine, message: bodyMessage, inputPrompt } = req.body
    const userId = req.callerUser.id
    const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
    const message = inputPrompt.length ? inputPrompt : bodyMessage

    if (!message) {
      return res.status(400).send("Message is required")
    }

    let thread = await threadsService.createThread({
      userId,
      message
    })

    const threadsList = await threadsService.getThreadsGroupedByDate(userId)

    const premAI = container.resolve<PremAI>(PremAI.token)
    const availableModels = await premAI.getAvailableModels(model)

    searchHandler({
      query: message,
      model,
      thread,
      searchEngine: searchEngine as WEB_SEARCH_ENGINE
    })

    thread = await threadsService.getOrFail(thread.id)

    return res
      .headers({
        "HX-Replace-Url": `/thread/${thread.id}`,
        "HX-Reswap": "none"
      })
      .view(
        <>
          <Sidebar
            activeThreadId={thread.id}
            threadsList={threadsList}
            swapOOB="outerHTML"
          />
          <ThreadPage
            swapOOB="outerHTML"
            thread={thread}
            availableModels={availableModels}
            availableSources={WEB_SEARCH_ENGINE_OPTIONS(searchEngine)}
            loading={true}
          />
        </>
      )
  })

  server.post(ROUTE.DELETE, {
    schema: schemas[ROUTE.DELETE]
  }, async (req, res) => {
    const { targetThreadId } = req.params
    const userId = req.callerUser.id
    const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
    await threadsService.deleteThread(userId, targetThreadId)

    return res.redirect("/")
  })

  server.post(ROUTE.SEND_MESSAGE, {
    schema: schemas[ROUTE.SEND_MESSAGE]
  }, async (req, res) => {
    const { model, searchEngine, message: bodyMessage, inputPrompt } = req.body
    const message = inputPrompt.length ? inputPrompt : bodyMessage
    const threadId = req.params.targetThreadId

    if (!message) {
      return res.status(400).send("Message is required")
    }

    const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
    const thread = await threadsService.getOrFail(threadId)

    searchHandler({
      query: message,
      model,
      thread,
      searchEngine: searchEngine as WEB_SEARCH_ENGINE
    })

    return res.view(
      <div>
        <UserMessage content={message} />
        <SourcesSection
          webSearchEngineType={searchEngine}
          sources={[]}
          loading={true}
          isCurrentMessage={true}
        />
        <ImagesSection
          images={[]}
          loading={true}
          isCurrentMessage={true}
        />
        <TextSection
          assistantModel={model}
          assistantError={null}
          assistantResponse={null}
          loading={true}
          isCurrentMessage={true}
        />
      </div>
    )
  })
})
