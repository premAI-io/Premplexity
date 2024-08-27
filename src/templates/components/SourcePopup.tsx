type Props = {
  title: string
  image: string
  link: string
  order: number
  snippet: string
}

const SourcePopup = ({
  title,
  image,
  link,
  order,
  snippet
}: Props) => {
  return (
    <div class={"source-popup__container"} data-source-popup text-ellipsis-exclude>
      <div class={"flex gap-2 items-center"}>
        <div class={"source-card__image shrink-0"}>
          <img src={image} alt={title} class={"h-full w-full object-center object-cover"} />
        </div>
        <div class={"flex flex-1 gap-1 items-center"}>
          <div class={"text-xs text-gray-200 font-semibold truncate max-w-[170px]"} safe>{link}</div>
          <div class={"source-card__id shrink-0"}>
            {order}
          </div>
        </div>
      </div>
      <div class={"source-popup__title"} safe>
        {title}
      </div>
      <div class={"source-popup__snippet"} safe>
        {snippet}
      </div>
    </div>
  )
}

export default SourcePopup
