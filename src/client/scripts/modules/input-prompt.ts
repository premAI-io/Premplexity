import htmx from "htmx.org"

export const onInputPromptInput = (event: InputEvent) => {
  const target = event.target as HTMLTextAreaElement
  target.style.height = "auto"
  target.style.height = target.scrollHeight + "px"

  const inputPromptSubmit = document.getElementById("input-prompt-submit")
  if (!inputPromptSubmit) {
    return
  }

  if (target.value.trim().length) {
    inputPromptSubmit.removeAttribute("disabled")
    inputPromptSubmit.classList.remove("btn--disabled")
  } else {
    inputPromptSubmit.setAttribute("disabled", "true")
    inputPromptSubmit.classList.add("btn--disabled")
  }
}

export const onInputPromptKeydown = (event: KeyboardEvent) => {
  const form = document.getElementById("thread-form") as HTMLFormElement
  const inputPrompt = event.target as HTMLTextAreaElement

  if (!form) {
    return
  }
  if (event.key === "Enter") {
    if (event.shiftKey) {
      if (inputPrompt.value.trim().length) {
        htmx.trigger(form, "submit", {})
        inputPrompt.blur()
      }
    }
  }
}

export const onPromptSubmit = () => {
  const prompt = document.getElementById("input-prompt-inner-container") as HTMLTextAreaElement | null
  if (!prompt) {
    return
  }

  prompt.value = ""
  const inputPromptSubmit = document.getElementById("input-prompt-submit")
  if (!inputPromptSubmit) {
    return
  }

  inputPromptSubmit.setAttribute("disabled", "true")
  inputPromptSubmit.setAttribute("disabled", "true")
  inputPromptSubmit.classList.add("btn--disabled")
}
