export type IconName =
  | "angle-down"
  | "close"
  | "link"
  | "plus"
  | "question-mark"
  | "redo-outline"
  | "rotate"
  | "search-outline"
  | "spinner"
  | "trash"
  | "book"
  | "chat-messages"
  | "dots-vertical"
  | "upload"
  | "brain"
  | "globe"
  | "initial-chat-icon"
  | "arrow-up"
  | "history"
  | "edit"
  | "file-copy"
export type IconProps = Omit<JSX.HtmlTag, "children"> & {
  class?: string
  name: IconName
  size?: number
  viewBox?: `0 0 ${number} ${number}`
}

export default ({
  class: className,
  name,
  size = 16,
  viewBox = "0 0 20 20",
}: IconProps) => {
  return (
    <div
      class={["icon", className]}
      style={{
        ["--icon-size" as keyof JSX.CSSProperties]: size,
      }}
    >
      <svg width={size} height={size} viewBox={viewBox} role="img">
        <use href={`#${name}`} />
      </svg>
    </div>
  )
}
