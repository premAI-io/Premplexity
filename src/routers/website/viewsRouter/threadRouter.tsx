import { FastifyPluginCallback, FastifyRequest } from "fastify"
import BaseLayout from "$templates/layouts/BaseLayout"
import NewThreadView from "$templates/views/NewThreadView"
import ThreadView from "$templates/views/ThreadView"
import { container } from "tsyringe"
import ThreadsService from "$services/ThreadsService"
import PremAI from "$components/PremAI"
import { WEB_SEARCH_ENGINE_OPTIONS } from "$types/WEB_SEARCH_ENGINE"

export const router: FastifyPluginCallback = (server, _, done) => {
  const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
  const premAI = container.resolve<PremAI>(PremAI.token)

  server.get("/", {}, async (req, res) => {
    const userId = req.callerUser.id
    const threadsList = await threadsService.getThreadsGroupedByDate(userId)

    const query = req.query as {
      model?: string,
      searchEngine?: string
    }

    const availableModels = await premAI.getAvailableModels(query?.model)

    return res.view(
      <NewThreadView
        threadsList={threadsList}
        availableModels={availableModels}
        availableSources={WEB_SEARCH_ENGINE_OPTIONS(query?.searchEngine)}
        githubUrl={req.globalResources.GITHUB_REPO_URL}
      />, BaseLayout)
  })

  server.get("/thread/:targetThreadId", {}, async (req: FastifyRequest<{ Params: { targetThreadId: string } }>, res) => {
    const userId = req.callerUser.id
    const threadsList = await threadsService.getThreadsGroupedByDate(userId)

    const currentThread = threadsList.flatMap(({ threads }) => threads).find(({ id }) => id === parseInt(req.params.targetThreadId))

    if (!currentThread) {
      return res.redirect("/")
    }

    const currentModel = currentThread.messages[currentThread.messages.length - 1].currentMessage.assistantModel
    const currentSearchEngine = currentThread.messages[currentThread.messages.length - 1].currentMessage.webSearchEngineType

    const availableModels = await premAI.getAvailableModels(currentModel)

    return res.view(
      <ThreadView
        threadsList={threadsList}
        chat={currentThread}
        availableModels={availableModels}
        availableSources={WEB_SEARCH_ENGINE_OPTIONS(currentSearchEngine ?? undefined)}
        githubUrl={req.globalResources.GITHUB_REPO_URL}
      />, BaseLayout)
  })

  return done()
}
