import Icon from "$templates/components/Icon"

type Props = {
  content: string
  source: string
  id: number
  image?: string
  isViewMore?: false
} | {
  isViewMore: true
}

const SourceCard = (props: Props) => {
  if (props.isViewMore) {
    return (
      <div class={"source-card__container bg-gray-600 !justify-between !p-0"}>
        <div class={"text-left pt-[8.5px] pl-[4.75px]"}>
          <Icon name="book" />
        </div>
        <div class={"text-right pb-1 pr-2 text-xs"}>
          View more
        </div>
      </div>
    )
  }

  const { content, source, id, image } = props
  return (
    <div class={"source-card__container"}>
      <div class={"source-card__content"} safe>
        {content}
      </div>
      <div class={"source-card__footer"}>
        <div class={"source-card__image"}>
          <img src={image ?? "https://via.placeholder.com/150"} class={"h-full w-full object-center object-cover"} />
        </div>
        <a class={"source-card__source"} href={source} data-tooltip-break-word safe target="_blank">
          {source}
        </a>
        <div class={"source-card__id"}>
          {id}
        </div>
      </div>
    </div>
  )
}

export default SourceCard
