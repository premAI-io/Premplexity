import { schemas } from "$routers/website/partialsRouter/thread/schemas"
import { ROUTE } from "$routers/website/partialsRouter/thread/types"
import { createRouter } from "$routers/website/utils"
import DeleteThreadModal from "$templates/components/DeleteThreadModal"

export const routerPrefix = "/thread"

export const router = createRouter((server) => {
  server.get(ROUTE.DELETE_MODAL, {
    schema: schemas[ROUTE.DELETE_MODAL]
  }, async (req, res) => {
    const { id } = req.params

    const component = DeleteThreadModal({
      threadId: id
    })

    return res.view(component)
  })
})
