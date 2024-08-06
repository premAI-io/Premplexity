import classNames from "classnames"
import Spinner from "./Spinner"
import { WithClass } from "$types/ui"

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl"
type ButtonType = "button" | "reset" | "submit"
type ButtonTheme =
  | "danger"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "info"
export type ButtonProps = WithClass<JSX.HtmlButtonTag> & {
  outline?: boolean
  round?: boolean
  size?: ButtonSize
  square?: boolean
  type?: ButtonType
  theme?: ButtonTheme
  withSpinner?: boolean
}

export default ({
  children,
  class: className,
  disabled = false,
  outline,
  round = false,
  size = "md",
  square = false,
  type,
  theme = "primary",
  withSpinner = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type || "button"}
      class={classNames(
        `btn btn--${theme} btn--${size}`,
        outline && "btn--outline",
        disabled && "btn--disabled",
        round && "btn--round",
        square && "btn--square",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {withSpinner
        ?
        <>
          <div class="btn__spinner">
            <Spinner />
          </div>

          <div class="btn__content">{children}</div>
        </>
        : children
      }
    </button>
  )
}
