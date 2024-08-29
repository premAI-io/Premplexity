import { WithClass } from "$types/ui"
import { PropsWithChildren } from "@kitajs/html"

type Props = Omit<WithClass<JSX.HtmlTag>, "onclick"> & PropsWithChildren<{
  dropdownId: string
}>

const DropdownTrigger = ({
  children,
  dropdownId,
  ...props
}: Props) => {
  return (
    <div
      class="flex items-center justify-center cursor-pointer"
      data-dropdown-toggle={dropdownId}
      onclick={`event.stopPropagation(); window.toggleDropdown("${dropdownId}")`}
      {...props}
    >
      {children}
    </div>
  )
}

export default DropdownTrigger
