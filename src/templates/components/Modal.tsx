import { PropsWithChildren } from "@kitajs/html"
import classNames from "classnames"

import Icon from "$templates/components/Icon"

type ModalSize = "sm" | "md" | "lg"
export type ModalProps = Omit<JSX.HtmlTag, "title"> &
  PropsWithChildren<{
    ariaLabelledby?: string
    centered?: boolean
    className?: string
    footer?: JSX.Element
    isOpen?: boolean
    size?: ModalSize
    title: JSX.Element
    removeOnClose?: boolean
    closable?: boolean
  }>

export default ({
  ariaLabelledby,
  centered,
  children,
  className,
  footer,
  isOpen = false,
  size = "md",
  title,
  removeOnClose = true,
  closable = true,
  ...props
}: ModalProps) => {
  return (
    <div
      class={classNames(
        `modal__wrap modal__wrap--${size}`,
        isOpen && "is-open",
        centered && "is-centered",
        className
      )}
      tabindex="-1"
      role="dialog"
      aria-labelledby={ariaLabelledby}
      aria-hidden="true"
      {...props}
    >
      <div class="modal__overlay" aria-hidden="true" {...closable ? { onclick: `closeModal(event, ${removeOnClose})` } : {}}></div>

      <div class="modal" role="document" onscroll="closeDropdowns(event.target);">
        <div class={"flex justify-between items-center gap-4 mb-4 pr-5"}>
          <div class="modal__title" id={ariaLabelledby}>
            {title}
          </div>

          {
            closable
              ?
              <button type="button" class="modal__close" aria-label="close" onclick={`closeModal(event, ${removeOnClose})`}>
                <Icon name="close" size={12} />
              </button>
              : null
          }
        </div>

        <div class="modal__content">{children as "safe"}</div>

        {footer
          ?
          <div class="modal__footer">
            {footer ? footer : null}
          </div>
          : null
        }
      </div>
    </div>
  )
}
