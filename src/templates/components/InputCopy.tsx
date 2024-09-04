import Icon from "./Icon"
import Input, { InputProps } from "$templates/components/Input"

type Props = Omit<InputProps, "append"> & {
  valueToCopy?: string
}

const InputCopy = ({
  valueToCopy,
  ...props
}: Props) => {
  return (
    <Input
      {...props}
      append={
        <div
          class="flex items-start cursor-pointer min-w-3"
          onclick="copyToClipboard(event, () => toggleCopyIcon(event.target))"
          data-value={valueToCopy ?? props.value}
        >
          <Icon name="file-copy" class="pointer-events-none text-gray-500" size={12} />
        </div>
      }
    />
  )
}

export default InputCopy
