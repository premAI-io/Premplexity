import Icon from "$templates/components/Icon"

type Props = {
  value: string
}

const CopyButton = ({
  value
}: Props) => {
  return (
    <button
      type="button"
      data-value={value}
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
