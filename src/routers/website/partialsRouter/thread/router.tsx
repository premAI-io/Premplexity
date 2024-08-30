import { schemas } from "$routers/website/partialsRouter/thread/schemas"
import { ROUTE } from "$routers/website/partialsRouter/thread/types"
import { createRouter } from "$routers/website/utils"
import ThreadMessagesService from "$services/ThreadMessagesService"
import ThreadsService from "$services/ThreadsService"
import DeleteThreadModal from "$templates/components/DeleteThreadModal"
import ImageLinkButton from "$templates/components/imagesListing/ImageLinkButton"
import ImagesListing from "$templates/components/imagesListing/ImagesListing"
import MainImage from "$templates/components/imagesListing/MainImage"
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

  server.get(ROUTE.IMAGES_LISTING, {
    schema: schemas[ROUTE.IMAGES_LISTING]
  }, async (req, res) => {
    const { targetThreadId, targetMessageId, targetImageOrder } = req.params

    const thread = await threadsService.getOrFail(targetThreadId)

    if (thread.userId !== req.callerUser.id) {
      return res.status(403).send("Forbidden")
    }

    const message = await threadMessagesService.getOrFail(targetMessageId, {
      where: eq(threadMessagesService.mainTable.threadId, targetThreadId)
    })

    let currentImage = message.sources.images.find(image => image.order === targetImageOrder)
    if (!currentImage) {
      currentImage = message.sources.images[0]
    }

    return res
      .header("HX-Trigger-After-Swap", "afterImageSwap")
      .view(
        <ImagesListing
          message={message}
          thread={thread}
          currentImage={currentImage}
        />
      )
  })

  server.get(ROUTE.IMAGE, {
    schema: schemas[ROUTE.IMAGE]
  }, async (req, res) => {
    const { targetThreadId, targetMessageId, targetImageOrder } = req.params

    const thread = await threadsService.getOrFail(targetThreadId)

    if (thread.userId !== req.callerUser.id) {
      return res.status(403).send("Forbidden")
    }

    const message = await threadMessagesService.getOrFail(targetMessageId, {
      where: eq(threadMessagesService.mainTable.threadId, targetThreadId)
    })

    let currentImage = message.sources.images.find(image => image.order === targetImageOrder)
    if (!currentImage) {
      currentImage = message.sources.images[0]
    }

    return res
      .header("HX-Reswap", "none")
      .header("HX-Trigger-After-Settle", "afterImageSwap")
      .view(
        <>
          <ImageLinkButton href={currentImage.link} swapOOB="outerHTML" />
          <MainImage image={currentImage.image} swapOOB="outerHTML" />
        </>
      )
  })
})
