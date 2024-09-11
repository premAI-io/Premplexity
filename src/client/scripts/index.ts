import "../htmx"
import htmx from "htmx.org"
import "htmx.org/dist/ext/response-targets"
import { loader } from "./modules/loader"
import "./modules/dropdown"
import "./modules/form"
import { BUTTON_DEBOUNCE } from "./modules/form"
import { initTooltips } from "src/client/scripts/modules/tooltip"
import { ToastType, createToast } from "src/client/scripts/modules/toast"
import { initTextEllipsis } from "src/client/scripts/modules/text-ellipsis"
import { onInputPromptInput, onInputPromptKeydown, onPromptSubmit } from "src/client/scripts/modules/input-prompt"
import { blockExecution, formatMarkdown, handleThreadSSEMessage, scrollToBottom } from "src/client/scripts/modules/threadCompletion"
import { SelectOption } from "$templates/components/SelectSearchable"
import { addPreCopyButtons } from "src/client/scripts/modules/markdown"
import { afterImageSwap } from "src/client/scripts/modules/images-listing"
import { onCancelEditMessageClick, onConfirmEditMessageClick, onEditMessageClick, openConfirmModal } from "src/client/scripts/modules/edit-message"

type OnSelectSearchItemClickOptions = {
  id: string
  label: string
  value: string
}

declare global {
  interface Window {
    htmx: typeof htmx
    onFileInputChange: (event: Event) => void
    togglePasswordInput: (event: MouseEvent) => void
    toggleAccordion: (event: MouseEvent) => void
    closeModal: (eventOrId: MouseEvent | string, remove?: boolean) => void
    closeModalIfSuccess: (event: CustomEvent, id: string) => void
    closeAlert: (eventOrId: MouseEvent | string) => void
    copyToClipboard: (eventOrValue: MouseEvent | string, onSuccess?: (copiedValue: string) => void) => void
    toggleCopyIcon: (element: HTMLElement, timeout?: number) => void
    // select search
    onSelectSearchBeforeRequest: (event: InputEvent) => void
    onSelectSearchAfterRequest: (event: CustomEvent) => void
    onSelectSearchItemClick: (options: OnSelectSearchItemClickOptions) => void
    onSelectSearchBlur: (value: string, options: string, id: string) => void
    // dropdown
    closeDropdown: (dropdownId: string) => void
    closeDropdowns: (container?: HTMLElement, exclude?: string) => void
    onDropdownResize: () => void
    openDropdown: (dropdownId: string, toggleElement?: HTMLElement) => void
    toggleDropdown: (dropdownId: string) => void
    // loader
    hideLoader: () => void
    downloadFile: (event: CustomEvent, button: HTMLButtonElement) => void
    hideSelect: (event: CustomEvent, selectId: string) => void
    // forms
    formValues: {
      [formId: string]: {
        [key: string]: number | string
      }
    }
    initForms: () => void
    registerForm: (formId: string) => void
    registerFormControl: (formId: string, inputName: string) => void
    onFormUpdate: (formOrId: HTMLFormElement | string) => void
    resetForm: (formOrId: HTMLFormElement | string) => void
    clearInputError: (elementOrSelector: HTMLInputElement | string) => void
    onFormBeforeRequest: (elementOrSelector: HTMLFormElement | string) => void
    onFormAfterRequest: (elementOrSelector: HTMLFormElement | string) => void
    validateJSON: (event: HashChangeEvent, form: HTMLFormElement) => void
    // toast
    showToast: (message: string, type: ToastType) => void
    // input prompt
    onInputPromptInput: (event: InputEvent) => void
    onInputPromptKeydown: (event: KeyboardEvent) => void
    onPromptSubmit: (params: { newMessageInserted: boolean }) => void
    blockExecution: () => void
    // sidebar
    onSidebarScroll: (event: Event) => void
    // edit message
    onEditMessageClick: (event: Event) => void
    onCancelEditMessageClick: (event: Event) => void
    onConfirmEditMessageClick: (event: Event) => void
    openConfirmModal: (event: Event) => void
  }
  interface HTMLInputElement {
    hasFormListener?: boolean
  }
  interface HTMLSelectElement {
    hasFormListener?: boolean
  }
  interface HTMLTextAreaElement {
    hasFormListener?: boolean
  }
}

// https://github.com/bigskysoftware/htmx/issues/2587
htmx.config.historyCacheSize = 0
htmx.config.scrollIntoViewOnBoost = false
htmx.config.defaultSwapStyle = "outerHTML"

window.addEventListener("DOMContentLoaded", () => {
  let debounceTimeout: number
  let buttonLoadingTimeout: number
  initTooltips()
  initTextEllipsis()
  formatMarkdown()
  addPreCopyButtons()
  scrollToBottom()

  window.addEventListener("resize", () => {
    initTextEllipsis()
    clearTimeout(debounceTimeout)
    debounceTimeout = window.setTimeout(() => {
      window.onDropdownResize()
    }, BUTTON_DEBOUNCE)
  })

  window.addEventListener("htmx:afterSwap", () => {
    initTextEllipsis()
    initTooltips()
    formatMarkdown()
    addPreCopyButtons()

    const target = (event as CustomEvent).detail.target as HTMLElement
    if (target.id === "thread-body" || target.id === "page") {
      scrollToBottom()
    }

    const sidebar = document.getElementById("sidebar")?.querySelector(".sidebar__body")
    if (sidebar) {
      const scrollPosition = localStorage.getItem("sidebarScrollPosition")
      if (scrollPosition) {
        sidebar.scrollTop = parseInt(scrollPosition)

        const activeThread = document.querySelector(".sidebar__body__item.active")
        // check if active thread is visible
        if (activeThread) {
          const sidebarRect = sidebar.getBoundingClientRect()
          const activeThreadRect = activeThread.getBoundingClientRect()
          if (activeThreadRect.top < sidebarRect.top || activeThreadRect.bottom > sidebarRect.bottom) {
            activeThread.scrollIntoView()
          }
        }
      }
    }
  })

  document.body.addEventListener("afterImageSwap", () => {
    afterImageSwap()
  })

  document.body.addEventListener("showSuccessToast", (event) => {
    const message = (event as CustomEvent).detail.value ?? "Operation completed successfully"
    createToast(message, "success")
  })

  document.body.addEventListener("showErrorToast", (event) => {
    const errorMessage = (event as CustomEvent).detail.value ?? "An unexpected error occurred, we're already working on it. Try again later or contact us"
    createToast(errorMessage, "error")
  })

  // Show warning toast on connection error
  document.body.addEventListener("htmx:sendError", () => {
    const errorMessage = "Connection error, please check your internet connection and try again"
    createToast(errorMessage, "warning")
  })

  document.body.addEventListener("click", () => {
    window.closeDropdowns()
  })

  document.body.addEventListener("htmx:historyRestore", () => {
    window.closeDropdowns()
  })

  document.body.addEventListener("htmx:beforeRequest", (event) => {
    const headers = (event as CustomEvent).detail.requestConfig.headers
    if (!headers["HX-Keep-Dropdown"]) {
      window.closeDropdowns()
    }
    if (headers["HX-Disable-Loader"] || headers["HX-Preload"]) {
      return
    }

    const isButton = ((event as CustomEvent).target as HTMLElement)?.tagName === "BUTTON"
    if (isButton) {
      buttonLoadingTimeout = window.setTimeout(() => {
        ((event as CustomEvent).target as HTMLElement)?.classList.add("btn--loading")
      }, BUTTON_DEBOUNCE)
    }

    loader.show()
  })

  document.body.addEventListener("htmx:afterRequest", (event) => {
    clearTimeout(buttonLoadingTimeout)
    const isButton = ((event as CustomEvent).target as HTMLElement)?.tagName === "BUTTON"
    if (isButton) {
      ((event as CustomEvent).target as HTMLElement)?.classList.remove("btn--loading")
    }
    loader.hide()
  })

  window.initForms()
  openUserSSERequest()
})

const openUserSSERequest = () => {
  const endpoint = "/actions/user/openSSE"
  const eventSource = new EventSource(endpoint)
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.threadId) {
      handleThreadSSEMessage(data)
    }
  }
}


window.addEventListener("popstate", () => {
  setTimeout(() => {
    initTooltips()
  }, 200)

  const id = setInterval(() => {
    if (loader.isReady()) {
      loader.hide()

      const buttons = document.querySelectorAll(".btn--loading")
      buttons.forEach((button) => {
        button.classList.remove("btn--loading")
      })

      clearInterval(id)
    }
  }, 20)
})

window.onFileInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  const label = target.nextElementSibling as HTMLLabelElement
  const labelText = label.querySelector(
    ".js-file-input-text"
  ) as HTMLSpanElement
  const labelValue = labelText.innerHTML
  let fileName: string | undefined

  if (files && files.length) {
    fileName = files[0].name
    if (fileName && fileName.length > 20) {
      fileName = `${fileName.slice(0, 20)}...${fileName.slice(
        fileName.length - 4
      )}`
    }
    labelText.innerHTML = fileName || labelValue
  }
}

window.togglePasswordInput = (e: MouseEvent) => {
  const parent = (e.target as HTMLDivElement).closest(".input__container")
  parent
    ?.querySelector("input")
    ?.setAttribute(
      "type",
      parent.querySelector("input")?.getAttribute("type") === "password"
        ? "text"
        : "password"
    )
  const tag = (e.currentTarget as HTMLDivElement).querySelector("svg use")
  tag?.setAttribute(
    "href",
    tag.getAttribute("href") === "#eye" ? "#eye-slash" : "#eye"
  )
}

window.toggleAccordion = (e: MouseEvent) => {
  const accordion = (e.target as HTMLDivElement).closest(".accordion")
  accordion?.classList.toggle("accordion--open")
}

window.closeModal = (eventOrId: MouseEvent | string, remove = true) => {
  let modal: HTMLElement | null = null
  if (typeof eventOrId === "string") {
    modal = document.getElementById(eventOrId)
  } else {
    modal = (eventOrId.target as HTMLElement).closest(".modal__wrap")
  }

  if (modal) {
    if (remove) {
      modal.remove()
    } else {
      modal.classList.remove("is-open")
    }
  }
}

/*
  Closes modals after htmx request success
  Must be called on afterRequest event
*/
window.closeModalIfSuccess = (event: CustomEvent, id: string, remove = true) => {
  if (event.detail.successful) {
    if (event.detail?.xhr?.status && event.detail.xhr.status !== 200) {
      return
    }
    window.closeModal(id, remove)
  }
}

window.closeAlert = (eventOrId: MouseEvent | string) => {
  let alert: HTMLElement | null = null
  if (typeof eventOrId === "string") {
    alert = document.getElementById(eventOrId)
  } else {
    alert = (eventOrId.target as HTMLElement).closest(".alert")
  }

  if (alert) {
    alert.remove()
  }
}

window.copyToClipboard = async (eventOrValue: MouseEvent | string, onSuccess?: (copiedValue: string) => void) => {
  let value: string
  if (typeof eventOrValue === "string") {
    value = eventOrValue
  } else {
    eventOrValue.preventDefault()
    eventOrValue.stopPropagation()
    const target = eventOrValue.target as HTMLElement
    value = target?.dataset?.["value"] ?? (
      target?.closest("[data-value]")?.getAttribute("data-value") ||
      target?.querySelector("[data-value]")?.getAttribute("data-value") ||
      ""
    )
  }
  try {
    await navigator.clipboard.writeText(value)
    onSuccess?.(value)
  } catch (err) {
    alert("Failed to copy text to clipboard: ")
  }
}

const TOGGLE_COPY_ICON_TIMEOUT = 2000
window.toggleCopyIcon = (element: HTMLElement, timeout = TOGGLE_COPY_ICON_TIMEOUT) => {
  const tag = element.tagName === "use" ? element : element.querySelector("use")
  if (tag) {
    tag.setAttribute("href", "#check")
    setTimeout(() => {
      tag?.setAttribute("href", "#file-copy")
    }, timeout)
  }
}

// select search

window.onSelectSearchBeforeRequest = (event: InputEvent) => {
  const input = event.target as HTMLInputElement
  if (!input) return
  const container = input.closest(".select__wrap")
  const inputHidden = container?.querySelector("input[type='hidden']") as HTMLInputElement | null
  if (inputHidden) {
    inputHidden.value = "0"
  }

  const options = Array.from(container?.querySelector(".dropdown__items")?.querySelectorAll(".dropdown__item") ?? []) as HTMLLIElement[]
  const search = input.value
  options.forEach((option) => {
    const label = option.textContent?.toLowerCase() || ""
    const value = option.getAttribute("data-value") || ""
    const valuesToSearch = [label, value.split("-").join(" ")]
    if (search === "" || valuesToSearch.some((v) => v.includes(search.toLowerCase()))) {
      option.style.display = "block"
    } else {
      option.style.display = "none"
    }
  })
  const visibleOptions = options.filter((option) => option.style.display !== "none")
  if (visibleOptions.length === 0) {
    const noResults = document.createElement("li")
    noResults.setAttribute("data-no-results", "true")
    noResults.classList.add("dropdown__item")
    const link = document.createElement("div")
    link.classList.add("dropdown__link")
    link.style.pointerEvents = "none"
    link.textContent = "No results found"
    noResults.appendChild(link)
    container?.querySelector(".dropdown__items")?.appendChild(noResults)
  } else {
    const noResults = container?.querySelectorAll("[data-no-results]")
    noResults?.forEach((el) => el.remove())
  }
}

window.onSelectSearchAfterRequest = (event: CustomEvent) => {
  const input = event.detail?.elt as HTMLInputElement
  if (!input) return
  const container = input.closest(".select__wrap")
  const iconTag = container?.querySelector(".select__icon use")
  if (iconTag) {
    iconTag.closest("div")?.classList.remove("animation-spin")
    iconTag.setAttribute("href", "#angle-down")
  }
}

window.onSelectSearchItemClick = (options: OnSelectSearchItemClickOptions) => {
  const container = document.getElementById(options.id)
  if (!container) {
    return
  }

  const dropdown = document.getElementById(`${options.id}-dropdown`)
  if (dropdown) {
    const items = dropdown.querySelectorAll(".dropdown__item")
    items.forEach((item) => {
      item.classList.toggle("dropdown__item--selected", item.getAttribute("data-value") === options.value)
      if (item.getAttribute("data-value") === options.value) {
        container.setAttribute("data-value", options.value)
      }
    })
  }

  const inputHidden = container.querySelector("input[type='hidden']") as HTMLInputElement | null
  if (inputHidden) {
    inputHidden.value = options.value
  }

  const inputText = container.querySelector("input[type='text']") as HTMLInputElement | null
  if (inputText) {
    inputText.value = options.label
  }

  // dispatch change event
  inputHidden?.dispatchEvent(new Event("change"))
  inputText?.dispatchEvent(new Event("change"))
}

window.hideSelect = (event: CustomEvent, selectId: string) => {
  const select = document.getElementById(selectId)
  if (select) {
    select.innerHTML = ""
  }
}

window.onSelectSearchBlur = (value: string, options: string, id: string) => {
  const parsedOptions = JSON.parse(options) as SelectOption[]
  if (!value || value.length === 0) {
    selectDefaultOption(id, parsedOptions)
  } else {
    const possibleOption = parsedOptions.find((option) => option.label.toString().toLowerCase() === value.toLowerCase())
    if (possibleOption) {
      window.onSelectSearchItemClick({ id, label: possibleOption.label.toString(), value: possibleOption.value.toString() })
    } else {
      selectDefaultOption(id, parsedOptions)
    }
  }
}

const selectDefaultOption = (id: string, options: SelectOption[]) => {
  const initialValue = document.getElementById(id)?.getAttribute("data-value") || ""
  const selectedOption = options.find((option) => option.value === initialValue) ?? options[0]
  window.onSelectSearchItemClick({ id, label: selectedOption.label.toString(), value: selectedOption.value.toString() })
}

// loader
window.hideLoader = loader.hide

window.downloadFile = async (event) => {
  const { url, partialKey: filename } = JSON.parse(event.detail.xhr.response)
  const response = await fetch(url)
  const blob = await response.blob()
  const urlObject = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = urlObject
  link.download = filename + ".zip"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// toast
window.showToast = createToast

// input prompt
window.onInputPromptInput = onInputPromptInput
window.onInputPromptKeydown = onInputPromptKeydown
window.onPromptSubmit = onPromptSubmit
window.blockExecution = blockExecution

// sidebar
window.onSidebarScroll = (event) => {
  // save scroll position in local storage
  const sidebar = event.target as HTMLElement
  const scrollPosition = sidebar.scrollTop
  localStorage.setItem("sidebarScrollPosition", scrollPosition.toString())
}

// edit message
window.onEditMessageClick = onEditMessageClick
window.onCancelEditMessageClick = onCancelEditMessageClick
window.onConfirmEditMessageClick = onConfirmEditMessageClick
window.openConfirmModal = openConfirmModal
