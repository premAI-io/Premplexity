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
    <div
      class={"image-card-container"}
      hx-get={getPartialPath("thread", "IMAGES_LISTING", { targetMessageId: messageId, targetThreadId: threadId, targetImageOrder: imageOrder })}
      hx-target="#modal"
      hx-swap="innerHTML"
    >
      <img src={image} class={"h-full w-full object-center object-cover"} />
    </div>
  )
}

export default ThreadImageCard
