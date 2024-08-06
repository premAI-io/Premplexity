import Dropdown from "$templates/components/Dropdown"
import DropdownTrigger from "$templates/components/DropdownTrigger"
import Icon from "$templates/components/Icon"
import { Children } from "@kitajs/html"
import classNames from "classnames"

type SelectSize = "sm" | "md" | "lg"
export type SelectOption = {
  label: number | string
  value: number | string
  selected?: boolean
}
export type SelectOptions = SelectOption[]
type SelectProps = Omit<JSX.HtmlSelectTag, "children"> & {
  id: string
  append?: Children
  caption?: Children
  error?: boolean | JSX.Element
  options?: SelectOptions
  label?: string | null
  size?: SelectSize
  readonly?: boolean
  swapOOB?: string
  prepend?: Children
}

export default ({
  id,
  append,
  caption,
  disabled = false,
  error,
  label,
  options = [],
  size = "sm",
  class: className,
  readonly,
  required,
  swapOOB,
  prepend,
  ...props
}: SelectProps) => {
  const dropdownId = `${id}-dropdown`
  return (
    <div
      class={[
        "select__wrap",
        !!append && "select__wrap--append",
        disabled && "select__wrap--disabled",
        !!error && "select__wrap--error",
        !!readonly && "select__wrap--readonly",
      ]}
      id={`${id}-wrapper`}
      hx-swap-oob={swapOOB}
    >
      {label
        ? (
          <label class="select__label">
            {label as "safe"} {required ? <span>*</span> : null}
          </label>
        )
        : null
      }

      <div class="select__container">
        {/* <div class={["select select--icon-hidden w-full", `select--${size}`, ...Array.isArray(className) ? className : [className]]} {...props} /> */}
        <DropdownTrigger
          dropdownId={dropdownId}
        >
          <div style="position: absolute; width: 100%; height: 100%; z-index: 2;"></div>
          <div class={"select__container__inner"}>
            {prepend ? prepend as "safe" : null}
            <select
              id={`${id}-value-container`}
              class={["select select--icon-hidden w-full", `select--${size}`, prepend ? "" : "pl-[10px]", ...Array.isArray(className) ? className : [className]]}
              {...props}
            >
              {options.map((option) => (
                <option value={`${option.value}`} selected={option.selected} safe>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div class="select__icon">
            <Icon name="angle-down" size={18} />
          </div>
        </DropdownTrigger>
        <Dropdown
          id={dropdownId}
          open={false}
          inheritWidth
          offset={0}
          class={"select__dropdown"}
        >
          <ul class="dropdown__items">
            {options.map((option) => (
              <li
                class={["dropdown__item", option.selected && "dropdown__item--selected"]}
                data-value={option.value}
                onclick={`
                  const select = document.getElementById('${id}-value-container');
                  const option = select.querySelector('option[value="${option.value}"]');
                  const currentSelectedOption = select.querySelector('option[selected]');
                  if (currentSelectedOption) {
                    currentSelectedOption.removeAttribute('selected');
                  }
                  option.selected = true;
                  const dropdownOptions = document.querySelectorAll('.dropdown__item');
                  dropdownOptions.forEach((option) => {
                    option.classList.remove('dropdown__item--selected');
                    if (option.getAttribute('data-value') === '${option.value}') {
                      option.classList.add('dropdown__item--selected');
                    }
                  });
                  select.dispatchEvent(new Event('change'));
                  clearInputError("#" + select.id);
                  closeDropdown('${dropdownId}');
                `}
              >
                <div class="dropdown__link">
                  <div class={"truncate"} safe>
                    {option.label}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Dropdown>
      </div>

      {(typeof error === "string" || caption)
        ? <div class={classNames("select__caption", error ? "select__caption--error" : "")}>
          {error || caption}
        </div>
        : null
      }
    </div>
  )
}
