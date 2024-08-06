import { FastifyPluginCallback, FastifyRequest } from "fastify"
import BaseLayout from "$templates/layouts/BaseLayout"
import NewThreadView from "$templates/views/NewThreadView"
import ThreadView from "$templates/views/ThreadView"
import { container } from "tsyringe"
import ThreadsService from "$services/ThreadsService"
import PremAI from "$components/PremAI"
import { WEB_SEARCH_ENGINE_OPTIONS } from "$types/WEB_SEARCH_ENGINE"

export const router: FastifyPluginCallback = (server, _, done) => {
  server.get("/", {}, async (req, res) => {
    const userId = req.callerUser.id
    const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
    const threadsList = await threadsService.getThreadsGroupedByDate(userId)

    const premAI = container.resolve<PremAI>(PremAI.token)
    const availableModels = await premAI.getAvailableModels()

    return res.view(
      <NewThreadView
        threadsList={threadsList}
        availableModels={availableModels}
        availableSources={WEB_SEARCH_ENGINE_OPTIONS}
      />, BaseLayout)
  })

  server.get("/thread/:targetThreadId", {}, async (req: FastifyRequest<{ Params: { targetThreadId: string } }>, res) => {
    const userId = req.callerUser.id
    const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
    const threadsList = await threadsService.getThreadsGroupedByDate(userId)

    const premAI = container.resolve<PremAI>(PremAI.token)
    const availableModels = await premAI.getAvailableModels()

    const currentThread = threadsList.flatMap(({ threads }) => threads).find(({ id }) => id === parseInt(req.params.targetThreadId))

    if (!currentThread) {
      return res.redirect("/")
    }

    return res.view(
      <ThreadView
        threadsList={threadsList}
        chat={currentThread}
        availableModels={availableModels}
        availableSources={WEB_SEARCH_ENGINE_OPTIONS}
      />, BaseLayout)
  })

  return done()
}
