import Button from "$templates/components/Button"
import Icon from "$templates/components/Icon"
import ImageLinkButton from "$templates/components/imagesListing/ImageLinkButton"
import Spinner from "$templates/components/Spinner"

type Props = {
  link: string
  image: string
  thumbnail?: string
}

const ImageMobile = ({
  link,
  image,
  thumbnail
}: Props) => {
  return (
    <div data-mobile-image class={"fixed w-full h-full top-0 left-0 flex justify-center items-center z-50"}>
      <div class={"fixed w-full h-full top-0 left-0 bg-gray-800 opacity-70 z-40"} />
      <div class={"!relative z-50 !mx-4"}>
        <div class={"flex justify-end mb-4"}>
          <Button theme="secondary" type="button" class="!px-[14px] !py-2" aria-label="close" onclick={"this.closest('[data-mobile-image]').remove()"}>
            <Icon name={"close"} class={"cursor-pointer"} />
          </Button>
        </div>
        <div
          id="main-image"
          class={"images-listing__main-image !pr-0 loading mb-4"}
        >
          <Spinner size={50} />
          <img
            src={image}
            alt="Main image"
            class={"max-w-full max-h-full object-center object-cover rounded-lg"}
            data-thumbnail={thumbnail}
          />
        </div>
        <div class={"mx-auto w-fit"}>
          <ImageLinkButton href={link} />
        </div>
      </div>
    </div>
  )
}

export default ImageMobile
