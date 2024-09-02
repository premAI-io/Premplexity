import { FastifyPluginCallback } from "fastify"
import BaseLayout from "$templates/layouts/BaseLayout"
import { container } from "tsyringe"
import ThreadsService from "$services/ThreadsService"
import HistoryView from "$templates/views/HistoryView"
import { getHtmxBrowserUrl } from "$routers/website/utils"
import PremAI from "$components/PremAI"
import { WEB_SEARCH_ENGINE_OPTIONS } from "$types/WEB_SEARCH_ENGINE"

export const router: FastifyPluginCallback = (server, _, done) => {
  const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
  const premAI = container.resolve<PremAI>(PremAI.token)

  server.get("/history", {}, async (req, res) => {
    const threadsList = await threadsService.getThreadsGroupedByDate(req.callerUser.id)

    let lastViewedThread = undefined

    const currentUrl = getHtmxBrowserUrl(req)?.href
    if (currentUrl && currentUrl.match(/\/thread\/\d+/)) {
      const targetThreadId = currentUrl.match(/\/thread\/(\d+)/)?.[1]
      if (targetThreadId) {
        lastViewedThread = threadsList.flatMap(({ threads }) => threads).find(({ id }) => id === parseInt(targetThreadId))
      }
    }

    const availableModels = await premAI.getAvailableModels()
    const availableSources = WEB_SEARCH_ENGINE_OPTIONS()

    return res.view(
      <HistoryView
        threadsList={threadsList}
        lastViewedThreadId={lastViewedThread?.id}
        availableModels={availableModels}
        availableSources={availableSources}
      />, BaseLayout)
  })

  return done()
}
