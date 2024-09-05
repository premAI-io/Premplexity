import { schemas } from "$routers/website/actionsRouter/snapshot/schemas"
import { ROUTE } from "$routers/website/actionsRouter/snapshot/types"
import { createRouter } from "../../utils"
import ThreadsService from "$services/ThreadsService"
import { container } from "tsyringe"
import ThreadShareLinksService from "$services/ThreadShareLinksService"
import NotFoundPage from "$templates/views/NotFoundView"
import BaseLayout from "$templates/layouts/BaseLayout"

export const routerPrefix = "/snapshot"

export const router = createRouter((server) => {
  const threadsService = container.resolve<ThreadsService>(ThreadsService.token)
  const threadShareLinksService = container.resolve<ThreadShareLinksService>(ThreadShareLinksService.token)

  server.get(ROUTE.IMPORT, {
    schema: schemas[ROUTE.IMPORT]
  }, async (req, res) => {
    const { targetSnapshotCode } = req.params

    const snapshot = await threadShareLinksService.getByCode(targetSnapshotCode)
    if (!snapshot) {
      return res.redirect("/")
    }

    const originalThread = await threadsService.getOrFail(snapshot.threadId)
    if (originalThread.deleted) {
      return res.view(<NotFoundPage />, BaseLayout)
    }

    if (originalThread.userId === req.callerUser.id) {
      return res.redirect("/thread/" + originalThread.id)
    }

    const thread = await threadShareLinksService.generateThread(snapshot, req.callerUser.id)
    return res.redirect("/thread/" + thread.id)
  })
})
