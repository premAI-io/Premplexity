export type IconName =
  | "angle-down"
  | "building"
  | "check"
  | "check-circle"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "chevron-double-right"
  | "clipboard"
  | "close"
  | "database"
  | "dots-horizontal"
  | "download"
  | "edit-user"
  | "exclamation"
  | "eye"
  | "eye-open"
  | "eye-slash"
  | "file-copy"
  | "file-import"
  | "file-invoice"
  | "file-pen"
  | "folder"
  | "folder-plus"
  | "grid"
  | "info-outline"
  | "link"
  | "lock"
  | "lock-open"
  | "minus"
  | "plus"
  | "question-mark"
  | "redo-outline"
  | "rotate"
  | "search-outline"
  | "spinner"
  | "trash"
  | "undo-outline"
  | "user"
  | "users"
  | "users-group"
  | "clock"
  | "ticket"
  | "lead"
  | "project"
  | "reports"
  | "statistics"
  | "reply"
  | "euro"
  | "right-arrow"
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
