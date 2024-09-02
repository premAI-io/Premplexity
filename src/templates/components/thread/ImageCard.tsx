import { getPartialPath } from "$routers/website/utils"

type Props = {
  threadId: number
  messageId: number
  image: string,
  imageOrder: number
}

const ThreadImageCard = ({
  image,
  messageId,
  threadId,
  imageOrder
}: Props) => {
  return (
    <>
      <div
        class={"image-card-container hidden md:block"}
        hx-get={getPartialPath("thread", "IMAGES_LISTING", { targetMessageId: messageId, targetThreadId: threadId, targetImageOrder: imageOrder })}
        hx-target="#modal"
        hx-swap="innerHTML"
      >
        <img src={image} class={"h-full w-full object-center object-cover"} />
      </div>
      <div
        class={"image-card-container md:hidden"}
        hx-get={getPartialPath("thread", "OPEN_IMAGE", { targetMessageId: messageId, targetThreadId: threadId, targetImageOrder: imageOrder })}
        hx-target="#modal"
        hx-swap="innerHTML"
      >
        <img src={image} class={"h-full w-auto max-w-none object-center object-cover"} />
      </div>
    </>
  )
}

export default ThreadImageCard
