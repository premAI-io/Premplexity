import { schemas } from "$routers/website/partialsRouter/thread/schemas"
import { ROUTE } from "$routers/website/partialsRouter/thread/types"
import { createRouter } from "$routers/website/utils"
import ThreadMessagesService from "$services/ThreadMessagesService"
import ThreadsService from "$services/ThreadsService"
import DeleteThreadModal from "$templates/components/DeleteThreadModal"
import SourcesModal from "$templates/components/thread/SourcesModal"
import { eq } from "drizzle-orm"
import { container } from "tsyringe"

export const routerPrefix = "/thread"

export const router = createRouter((server) => {

  const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
  const threadMessagesService = container.resolve<ThreadMessagesService>(ThreadMessagesService.token)

  server.get(ROUTE.DELETE_MODAL, {
    schema: schemas[ROUTE.DELETE_MODAL]
  }, async (req, res) => {
    const { targetThreadId } = req.params

    return res.view(
      <DeleteThreadModal
        threadId={targetThreadId}
      />
    )
  })

  server.get(ROUTE.SOURCES_MODAL, {
    schema: schemas[ROUTE.SOURCES_MODAL]
  }, async (req, res) => {
    const { targetThreadId, targetMessageId } = req.params

    const thread = await threadsService.getOrFail(targetThreadId)

    if (thread.userId !== req.callerUser.id) {
      return res.status(403).send("Forbidden")
    }

    const message = await threadMessagesService.getOrFail(targetMessageId, {
      where: eq(threadMessagesService.mainTable.threadId, targetThreadId)
    })

    return res.view(
      <SourcesModal sources={message.sources.pages} webSearchEngineType={message.webSearchEngineType} />
    )
  })
})
