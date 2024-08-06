import WebappSSEManager from "$components/WebappSSEManager"
import { schemas } from "$routers/website/actionsRouter/user/schemas"
import { ROUTE } from "$routers/website/actionsRouter/user/types"
import { createRouter } from "$routers/website/utils"
import { container } from "tsyringe"

export const routerPrefix = "/user"

export const router = createRouter((server) => {
  const sseComponent = container.resolve<WebappSSEManager>(WebappSSEManager.token)

  server.get(ROUTE.OPEN_SSE, {
    schema: schemas[ROUTE.OPEN_SSE]
  }, async (req, res) => {
    const targetUserId = req.callerUser.id

    const sseStream = await sseComponent.SSEManager.createSSEStream(res)
    await sseStream.addToRoom(WebappSSEManager.getUserRoomId(targetUserId),)
  })
})
