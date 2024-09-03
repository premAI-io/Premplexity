import { getPartialPath } from "$routers/website/utils"
import Icon from "$templates/components/Icon"

type Props = {
  content: string
  source: string
  id: number
  image?: string
  title: string
  isViewMore?: false
} | {
  threadId: number
  messageId: number
  isViewMore: true
}

const SourceCard = (props: Props) => {
  if (props.isViewMore) {
    return (
      <div
        class={"source-card__container bg-gray-600 cursor-pointer !w-fit md:!w-full !flex-row md:!flex-col md:!justify-between md:!p-0"}
        hx-get={getPartialPath("thread", "SOURCES_MODAL", { targetThreadId: props.threadId, targetMessageId: props.messageId })}
        hx-target="#modal"
        hx-swap="innerHTML"
      >
        <div class={"md:text-left md:pt-[8.5px] md:pl-[4.75px]"}>
          <Icon name="book" />
        </div>
        <div class={"md:text-right md:pb-1 md:pr-2 text-xs truncate"}>
          View more
        </div>
      </div>
    )
  }

  const { content, source, id, image } = props
  return (
    <div class={"source-card__container cursor-pointer"} data-source-popup={JSON.stringify({
      title: props.title,
      favicon: image ?? "https://via.placeholder.com/150",
      link: source,
      order: id,
      snippet: content
    })} text-ellipsis-exclude onclick={`window.open("${source}", "_blank")`}>
      <div class={"source-card__content"} safe>
        {content}
      </div>
      <div class={"source-card__footer"}>
        <div class={"source-card__image"}>
          <img src={image ?? "https://via.placeholder.com/150"} class={"h-full w-full object-center object-cover"} />
        </div>
        <div class={"source-card__source"} safe>
          {source}
        </div>
        <div class={"source-card__source--mobile"} safe>
          {source.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0]}
        </div>
        <div class={"source-card__id"}>
          {id}
        </div>
      </div>
    </div>
  )
}

export default SourceCard
