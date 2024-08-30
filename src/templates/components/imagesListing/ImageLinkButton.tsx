import Button from "$templates/components/Button"
import Icon from "$templates/components/Icon"

type Props = {
  href: string
  swapOOB?: string
}

const ImageLinkButton = ({
  href,
  swapOOB
}: Props) => {
  return (
    <a id="image-link-button" href={href} target="_blank" {...swapOOB ? { "hx-swap-oob": swapOOB } : {}}>
      <Button theme="secondary" type="button" class="w-[151px]">
        <Icon name={"link"} class={"cursor-pointer"} size={15} viewBox={"0 0 15 14"} />
        <div class={"truncate"} safe>
          {href.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0]}
        </div>
      </Button>
    </a>
  )
}

export default ImageLinkButton
