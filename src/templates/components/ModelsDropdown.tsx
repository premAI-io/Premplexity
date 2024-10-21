/* eslint-disable indent */
import { Children } from "@kitajs/html"
import Icon from "./Icon"
import Dropdown from "./Dropdown"
import DropdownTrigger from "./DropdownTrigger"
import classNames from "classnames"
import { SelectOption } from "$templates/components/SelectSearchable"
import { toTitleCase } from "$utils/format"

type SelectSize = "sm" | "md" | "lg"

type SelectProps = {
  caption?: Children
  class?: string
  disabled?: boolean
  dropdownOpen?: boolean
  error?: boolean | JSX.Element
  form?: string
  id: string
  inputName?: string
  inputValue?: string
  label?: JSX.Element
  name?: string
  options?: Record<string, SelectOption[]>
  placeholder?: string
  selectClass?: string
  size?: SelectSize
  value?: string
  onSelect?: `${string}({ id, label, value })`
  onBeforeRequest?: string
  onAfterRequest?: string
  onOptionSelected?: string
  swapOOB?: boolean,
  required?: boolean
  readonly?: boolean,
  prepend?: Children
} & Htmx.Attributes

const ModelsDropdown = ({
  caption,
  class: className,
  disabled,
  dropdownOpen,
  error,
  form,
  id,
  inputName = "search",
  inputValue,
  label,
  name,
  options = {},
  placeholder,
  selectClass,
  size = "sm",
  value,
  onSelect,
  onOptionSelected,
  swapOOB,
  required = false,
  readonly,
  prepend,
  ...htmxProps
}: SelectProps) => {
  const dropdownId = `${id}-dropdown`
  const inputId = `${id}-input`

  return (
    <div
      class={[
        `select__wrap select__wrap--${size} select__wrap--append`,
        disabled && "select__wrap--disabled",
        readonly && "select__wrap--readonly",
        error && "select__wrap--error",
        className
      ]}
      id={id}
      data-value={value}
      {...swapOOB ? { "hx-swap-oob": "true" } : {}}
    >
      {label
        ? <label class="select__label">{label} { required ? <span>*</span>: null }</label>
        : null
      }

      <div class="select__container">
        <input
          type="hidden"
          name={name}
          value={value ?? "0"}
          disabled={disabled}
          form={form}
          required={required}
        />
        <div id={`inner-container-${inputId}`} class={"select__container__inner"}>
          {prepend ? prepend as "safe" : null}
          <input
            id={inputId}
            name={inputName}
            type="text"
            class={["select select--icon-hidden w-full", selectClass]}
            value={inputValue}
            placeholder={placeholder}
            disabled={disabled}
            {...htmxProps}
            hx-swap="none"
            onclick="event.stopPropagation()"
            onfocus={`closeDropdowns(); openDropdown('${dropdownId}');`}
            oninput={`onModelsDropdownSearch(event);onSelectSearchItemClick({ id: "${id}", label: event.target.value, value: "0" });`}
            onblur={`onModelsDropdownSearchBlur(this.value, '${JSON.stringify(options)}', "${id}");`}
            autocomplete="off"
            required={required}
            readonly={readonly}
          />
        </div>

        <DropdownTrigger
          class="select__icon"
          dropdownId={dropdownId}
        >
          <Icon name="angle-down" size={18} />
        </DropdownTrigger>

        <Dropdown
          id={dropdownId}
          open={dropdownOpen ?? !!inputValue}
          inheritWidth
          offset={0}
          data-reference={`inner-container-${inputId}`}
          class={"select__dropdown"}
        >
          <ul class="dropdown__items">
            {Object.keys(options).length
              ?
              Object.keys(options).map((provider) => {
                return (
                  <>
                    <div class="truncate pl-1 font-semibold" safe data-provider-name={provider}>{toTitleCase(provider)}</div>
                    {options[provider].map((option) => (
                          <li
                          class={["dropdown__item ml-2", option.selected && "dropdown__item--selected"]}
                          onclick={`
                            onSelectSearchItemClick({ id: "${id}", label: "${option.label}", value: "${option.value}" });
                            clearInputError('#${inputId}');
                            ${onSelect ?
                              onSelect
                                .replace("id", `id:'${id}'`)
                                .replace("label", `label:'${option.label}'`).replace("value", `value:'${option.value}'`)
                              : ""
                            }
                            ${onOptionSelected ?
                              onOptionSelected
                              : ""
                            }
                            closeDropdown("${id}-dropdown")
                            const container = document.getElementById("${id}-dropdown")
                            const dropdownOptions = Array.from(container?.querySelector(".dropdown__items")?.querySelectorAll(".dropdown__item") ?? [])
                            dropdownOptions.forEach((option) => option.style.display = "block")
                            const noResults = container?.querySelectorAll("[data-no-results]")
                            noResults?.forEach((el) => el.remove())
                          `}
                          data-value={option.value}
                          data-provider={provider}
                        >
                          <div class="dropdown__link">
                            <div class={"truncate"} safe>{option.label}</div>
                          </div>
                        </li>
                    ))}
                  </>
                )
              })
              : inputValue
                ?
                <li class="dropdown__item">
                  <div class="dropdown__link">
                    No results found
                  </div>
                </li>
                : null
            }
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

export default ModelsDropdown
