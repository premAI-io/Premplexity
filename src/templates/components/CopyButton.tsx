import Icon from "$templates/components/Icon"
import classNames from "classnames"

type Props = {
  value: string
  disabled?: boolean
}

const CopyButton = ({
  value,
  disabled
}: Props) => {
  return (
    <button
      class={classNames("flex items-center justify-center", {
        "opacity-50": disabled
      })}
      type="button"
      data-value={value}
      disabled={disabled}
      onclick={`
        copyToClipboard(event, () => {
          toggleCopyIcon(event.target)
        })
      `}
    >
      <Icon name={"file-copy"} size={16} />
    </button>
  )
}

export default CopyButton
