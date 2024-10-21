import { Children } from "@kitajs/html"
import classNames from "classnames"

type InputSize = "sm" | "md" | "lg"
export type InputProps = Omit<JSX.HtmlInputTag, "class"> & {
  onpaste?: string
  append?: Children
  caption?: Children
  class?: string
  error?: boolean | JSX.Element
  label?: string | JSX.Element | null
  prepend?: Children
  size?: InputSize
  min?: number
  max?: number
  singleDate?: boolean
  maxDateCurrent?: boolean
  ignoreOnePassword?: boolean
}

export default ({
  append,
  caption,
  class: className,
  disabled = false,
  error,
  label,
  placeholder,
  prepend,
  readonly = false,
  size = "md",
  type,
  min,
  max,
  singleDate,
  maxDateCurrent,
  ignoreOnePassword = true,
  ...props
}: InputProps) => {
  return (
    <div
      class={[
        "input__wrap",
        !!append && "input__wrap--append",
        disabled && "input__wrap--disabled",
        !!error && "input__wrap--error",
        !!prepend && "input__wrap--prepend",
        readonly && "input__wrap--readonly",
        className
      ]}
    >
      {label
        ? (
          <label class="input__label">
            {label as "safe"}
          </label>
        )
        : null
      }

      <div class="input__container">
        {prepend
          ? (
            <div class="input__icon input__icon--prepend">
              {prepend as "safe"}
            </div>
          )
          : null
        }
        <input
          {...props}
          disabled={disabled}
          readonly={readonly}
          type={type}
          min={type === "number" ? min : undefined}
          max={type === "number" ? max : undefined}
          placeholder={placeholder ?? undefined}
          class={`input input--${size}`}
          data-1p-ignore={ignoreOnePassword}
          data-date-single={singleDate}
          data-max-date-current={maxDateCurrent}
        />
        {append
          ? (
            <div class="input__icon input__icon--append">{append as "safe"}</div>
          )
          : null
        }
      </div>

      {(typeof error === "string" || caption)
        ? (
          <div class={classNames("input__caption", error ? "input__caption--error" : "")}>
            {error || caption}
          </div>
        )
        : null
      }
    </div>
  )
}
