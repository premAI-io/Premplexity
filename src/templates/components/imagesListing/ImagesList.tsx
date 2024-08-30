import { getPartialPath } from "$routers/website/utils"
import { ImageThreadMessageSourcesServiceComplete } from "$services/ThreadMessageSourcesService"
import Spinner from "$templates/components/Spinner"
import classNames from "classnames"

type Props = {
  threadId: number
  images: ImageThreadMessageSourcesServiceComplete[]
  currentImageId: number
}

const Image = ({
  threadId,
  image,
  currentImageId
}: {
  threadId: number
  image: ImageThreadMessageSourcesServiceComplete,
  currentImageId: number
}) => (
  <div
    class={classNames("image-list__item loading", { "active": image.id === currentImageId })}
    hx-get={getPartialPath("thread", "IMAGE", { targetImageOrder: image.order, targetThreadId: threadId, targetMessageId: image.threadMessageId })}
    hx-target={"#image-link-button,#main-image"}
    {...{
      "hx-on::after-request": "document.querySelector(\".image-list__item.active\")?.classList.remove(\"active\");this.classList.add(\"active\")"
    }}
  >
    <Spinner />
    <img
      src={image.thumbnail}
      alt="Image"
      class={"object-cover object-center"}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      onload={"this.parentElement.classList.remove('loading')"}
    />
  </div>
)

const ImagesList = ({
  threadId,
  images,
  currentImageId
}: Props) => {
  const evenImages = images.filter(image => image.order % 2 === 0)
  const oddImages = images.filter(image => image.order % 2 !== 0)

  return (
    <div class={"images-list__container"}>
      <div class={"image-list__column"}>
        {oddImages.map(image => (
          <Image image={image} currentImageId={currentImageId} threadId={threadId} />
        ))}
      </div>
      <div class={"image-list__column"}>
        {evenImages.map(image => (
          <Image image={image} currentImageId={currentImageId} threadId={threadId} />
        ))}
      </div>
    </div>
  )
}

export default ImagesList
