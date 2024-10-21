import { PropsWithChildren } from "@kitajs/html"
import classNames from "classnames"

import Icon, { IconName } from "./Icon"
import { DropdownPosition } from "src/client/scripts/modules/dropdown"

export type DropdownItem = JSX.HtmlAnchorTag & {
  icon?: IconName
  id?: string
  title: string
  type?: "primary" | "danger"
}
type DropdownProps = Omit<JSX.HtmlTag, "id"> &
  PropsWithChildren<{
    clone?: boolean
    inheritWidth?: boolean
    id: string
    items?: DropdownItem[]
    offset?: number
    open?: boolean
    position?: DropdownPosition
    relative?: boolean | string
  }>

export default ({
  clone,
  children,
  inheritWidth,
  id,
  items = [],
  offset,
  open = false,
  position = "bottom",
  relative = false,
  ...props
}: DropdownProps) => {
  return (
    <div
      id={id}
      {...props}
      class={classNames(
        "dropdown",
        open && "dropdown--open",
        relative && "dropdown--relative",
        props.class
      )}
      text-ellipsis-exclude
      data-clone={clone ? "" : undefined}
      data-inherit-width={inheritWidth ? "" : undefined}
      data-offset={offset}
      data-position={position}
      data-relative={relative ? (typeof relative === "string" ? relative : "") : undefined}
      onclick="event.stopPropagation()"
    >
      {items.length > 0
        ? (
          <ul class="dropdown__items">
            {items.map(({
              href,
              icon,
              title,
              type = "primary",
              ...itemProps
            }) => (
              <li class={`dropdown__item dropdown__item--${type}`}>
                {href
                  ?
                  <a hx-boost="true" href={href} class="dropdown__link" {...itemProps}
                    {...{
                      "hx-on::after-request": `${itemProps["hx-on::after-request" as keyof typeof itemProps] || ""};hideLoader();closeDropdowns()`
                    }}>
                    {icon ? (
                      <div class="dropdown__link-icon">
                        <Icon name={icon} size={14} />
                      </div>
                    ) : null}{" "}
                    <p class={"truncate"} safe> {title} </p>
                  </a>
                  :
                  <button class="dropdown__link" {...itemProps}
                    {...{
                      "hx-on::after-request": `${itemProps["hx-on::after-request" as keyof typeof itemProps] || ""};hideLoader();closeDropdowns()`
                    }}
                  >
                    {icon ? (
                      <div class="dropdown__link-icon">
                        <Icon name={icon} size={14} />
                      </div>
                    ) : null}{" "}
                    <p class={"truncate"} safe> {title} </p>
                  </button>
                }
              </li>
            ))}
          </ul>
        )
        : null
      }
      {children ? (
        <div class="dropdown__content">{children as "safe"}</div>
      ) : null}
    </div>
  )
}
