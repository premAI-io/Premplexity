import { ImageThreadMessageSourcesServiceComplete } from "$services/ThreadMessageSourcesService"
import { ThreadMessageComplete } from "$services/ThreadMessagesService"
import { ThreadComplete } from "$services/ThreadsService"
import Button from "$templates/components/Button"
import Icon from "$templates/components/Icon"
import ImageLinkButton from "$templates/components/imagesListing/ImageLinkButton"
import ImagesList from "$templates/components/imagesListing/ImagesList"
import MainImage from "$templates/components/imagesListing/MainImage"
import PremplexityLogo from "$templates/components/PremplexityLogo"

type Props = {
  thread: ThreadComplete
  message: ThreadMessageComplete
  currentImage: ImageThreadMessageSourcesServiceComplete
}

const ImagesListing = ({
  thread,
  message,
  currentImage
}: Props) => {
  return (
    <div class={"images-listing__overlay"} id="images-listing">
      <div class={"images-listing__header"}>
        <div class={"flex-container"}>
          <PremplexityLogo />
          <h2 class={"text-2xl"} safe>{thread.title}</h2>
        </div>
        <div class={"flex-container !gap-[34px]"}>
          <ImageLinkButton href={currentImage.link} />
          <Button theme="secondary" type="button" class="!px-[14px] !py-2" aria-label="close" onclick={"closeModal('images-listing', true)"}>
            <Icon name={"close"} class={"cursor-pointer"} />
          </Button>
        </div>
      </div>
      <div class={"images-listing__content"}>
        <MainImage image={currentImage.image} thumbnail={currentImage.thumbnail} />
        <ImagesList images={message.sources.images} currentImageId={currentImage.id} threadId={thread.id} />
      </div>
    </div>
  )
}

export default ImagesListing
