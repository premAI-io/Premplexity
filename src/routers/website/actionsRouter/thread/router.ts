import { schemas } from "$routers/website/actionsRouter/thread/schemas"
import { ROUTE } from "$routers/website/actionsRouter/thread/types"
import { createRouter } from "$routers/website/utils"
import ThreadsService from "$services/ThreadsService"
import { container } from "tsyringe"
import ThreadView from "$templates/views/ThreadView"
import PremAI from "$components/PremAI"
import { WEB_SEARCH_ENGINE_OPTIONS } from "$types/WEB_SEARCH_ENGINE"

export const routerPrefix = "/thread"

export const router = createRouter((server) => {
  server.post(ROUTE.CREATE, {
    schema: schemas[ROUTE.CREATE]
  }, async (req, res) => {
    const { model, source, message } = req.body
    const userId = req.callerUser.id
    const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
    const thread = await threadsService.createThread({
      message,
      model,
      source,
      userId
    })

    const threadsList = await threadsService.getThreadsGroupedByDate(userId)

    const premAI = container.resolve<PremAI>(PremAI.token)
    const availableModels = await premAI.getAvailableModels()

    const component = ThreadView({
      chat: thread,
      threadsList,
      availableModels,
      availableSources: WEB_SEARCH_ENGINE_OPTIONS
    })

    return res
      .header("HX-Push-Url", `/thread/${thread.id}`)
      .view(component)
  })

  server.post(ROUTE.DELETE, {
    schema: schemas[ROUTE.DELETE]
  }, async (req, res) => {
    const { id } = req.params
    const userId = req.callerUser.id
    const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
    await threadsService.deleteThread(userId, id)

    return res.redirect("/")
  })
})
