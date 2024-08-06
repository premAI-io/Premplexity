import Icon, { IconProps } from "./Icon"

type Props = Omit<IconProps, "name">

const Spinner = ({
  class: className,
  ...props
}: Props) => {
  return (
    <Icon
      name="spinner"
      class={`animate-spin${className ? ` ${className}` : ""}`}
      {...props}
    />
  )
}

export default Spinner
