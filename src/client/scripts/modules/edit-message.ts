import htmx from "htmx.org"

export const onEditMessageClick = (event: Event) => {
  event.stopPropagation()
  const target = (event.target as HTMLElement).closest("button") as HTMLButtonElement
  const textarea = target.closest("div")?.querySelector("textarea[data-message]") as HTMLTextAreaElement
  const div = target.closest("div")?.querySelector("div[data-message-container]") as HTMLDivElement

  if (textarea && div) {
    div.classList.add("hidden")
    div.setAttribute("data-container-hidden", "true")
    textarea.classList.remove("hidden");
    (textarea.parentNode as HTMLElement).classList.add("w-full")
    textarea.removeAttribute("readonly")
    textarea.addEventListener("input", onMessageInput)
    textarea.addEventListener("keydown", onMessageKeyDown)
    textarea.setAttribute("data-original", textarea.value)
    textarea.style.height = "auto"
    textarea.style.height = textarea.scrollHeight + "px"
    textarea.addEventListener("focus", () => {
      textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    })
    textarea.focus()
  }
  document.addEventListener("click", onOutsideClick)
}

const onOutsideClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).closest("#confirm-edit-message-button") || (event.target as HTMLElement).closest("#cancel-edit-message-button")) {
    return
  }

  if ((event.target as HTMLElement).closest("textarea[data-original]")) {
    return
  }

  if ((event.target as HTMLElement).closest("#confirm-modal-container")) {
    return
  }

  openConfirmModal(event)
}

export const openConfirmModal = (event: Event) => {
  event.stopPropagation()
  const textarea = document.querySelector("div[data-user-message]")?.querySelector("textarea[data-original]") as HTMLTextAreaElement | undefined
  if (!textarea) {
    return
  }

  const message = textarea.value
  // need to add message === "" because safari fill empty string with LF (line feed)
  if (!message || message.length === 0 || message === "" || message === textarea.getAttribute("data-original")) {
    onCancelEditMessageClick(event)
    return
  }

  const confirmModal = document.getElementById("confirm-modal-container")?.querySelector(".modal__wrap")
  if (confirmModal) {
    confirmModal.classList.add("is-open")
  }
}

export const onConfirmEditMessageClick = (event: Event) => {
  event.stopPropagation()
  const textarea = document.querySelector("div[data-user-message]")?.querySelector("textarea[data-original]") as HTMLTextAreaElement | undefined
  if (!textarea) {
    return
  }

  const message = textarea.value
  // need to add message === "" because safari fill empty string with LF (line feed)
  if (!message || message.length === 0 || message === "" || message === textarea.getAttribute("data-original")) {
    onCancelEditMessageClick(event)
    return
  }
  const model = (document.querySelector("input[name='model']") as HTMLInputElement | undefined)?.value || ""
  const searchEngine = (document.querySelector("input[name='searchEngine']") as HTMLInputElement | undefined)?.value || ""
  const endpoint = textarea.getAttribute("data-endpoint") || ""

  const encodedMessage = encodeURIComponent(message)

  htmx.ajax(
    "POST",
    endpoint + `?model=${model}&searchEngine=${searchEngine}&message=${encodedMessage}`,
    {
      target: "#last-message",
      swap: "innerHTML",
    }
  )

  textarea.classList.add("hidden");
  (textarea.parentNode as HTMLElement).classList.remove("w-full")
  textarea.removeEventListener("input", onMessageInput)
  textarea.removeEventListener("keydown", onMessageKeyDown)
  const div = textarea.closest("div")?.querySelector("div[data-message-container]") as HTMLDivElement

  const inputPrompt = document.getElementById("input-prompt-inner-container") as HTMLTextAreaElement | null
  inputPrompt?.setAttribute("data-response-loading", "true")

  div.innerText = message
  div.classList.remove("hidden")
  div.removeAttribute("data-container-hidden")
  document.removeEventListener("click", onOutsideClick)
}

export const onCancelEditMessageClick = (event: Event) => {
  event.stopPropagation()
  const textarea = document.querySelector("div[data-user-message]")?.querySelector("textarea[data-original]") as HTMLTextAreaElement | undefined
  if (!textarea) {
    return
  }

  textarea.value = textarea.getAttribute("data-original") || ""
  textarea.removeAttribute("data-original")
  textarea.removeEventListener("input", onMessageInput)
  textarea.setAttribute("readonly", "true")
  textarea.classList.add("hidden");
  (textarea.parentNode as HTMLElement).classList.remove("w-full")
  textarea.removeEventListener("input", onMessageInput)
  textarea.removeEventListener("keydown", onMessageKeyDown)
  const div = textarea.closest("div")?.querySelector("div[data-message-container]") as HTMLDivElement
  div.classList.remove("hidden")
  div.removeAttribute("data-container-hidden")
  document.removeEventListener("click", onOutsideClick)
}


const onMessageInput = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = "27px"
  textarea.style.height = textarea.scrollHeight + "px"

  const confirmButton = document.getElementById("confirm-edit-message-button") as HTMLButtonElement
  if (!confirmButton) {
    return
  }

  if (textarea.value.trim().length) {
    confirmButton.removeAttribute("disabled")
    confirmButton.classList.remove("opacity-50")
  } else {
    confirmButton.setAttribute("disabled", "true")
    confirmButton.classList.add("opacity-50")
  }
}

const onMessageKeyDown = (event: KeyboardEvent) => {
  const isMobile = document.getElementById("page")?.getAttribute("data-is-mobile") === "true"
  if (!isMobile) {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        return
      }
      event.preventDefault()
      const confirmButton = document.getElementById("confirm-edit-message-button") as HTMLButtonElement
      if (confirmButton) {
        confirmButton.click()
      }
    }
  }
}
