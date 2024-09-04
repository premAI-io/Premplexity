import htmx from "htmx.org"

export const onEditMessageClick = (event: Event) => {
  event.stopPropagation()
  const target = (event.target as HTMLElement).closest("button") as HTMLButtonElement
  const div = target.closest("div")?.querySelector("div[data-message]") as HTMLDivElement

  if (div) {
    div.contentEditable = "true"
    div.addEventListener("keydown", onMessageKeyDown)
    div.setAttribute("data-original", div.innerText)
    div.addEventListener("focus", () => {
      const range = document.createRange()
      range.selectNodeContents(div)
      const sel = window.getSelection()
      if (sel) {
        sel.removeAllRanges()
        sel.addRange(range)
      }
    })
    div.focus()
  }
  document.addEventListener("click", onOutsideClick)
}

const onOutsideClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).closest("div[data-original]")) {
    return
  }

  const div = document.querySelector("div[data-original]") as HTMLDivElement
  if (div) {
    div.innerText = div.getAttribute("data-original") || ""
    div.removeAttribute("data-original")
    div.removeEventListener("keydown", onMessageKeyDown)
    div.contentEditable = "false"
  }
}

const onMessageKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault()
    const div = event.target as HTMLDivElement
    const model = (document.querySelector("input[name='model']") as HTMLInputElement | undefined)?.value || ""
    const searchEngine = (document.querySelector("input[name='searchEngine']") as HTMLInputElement | undefined)?.value || ""
    const endpoint = div.getAttribute("data-endpoint") || ""
    const message = div.innerText

    htmx.ajax(
      "POST",
      endpoint + `?model=${model}&searchEngine=${searchEngine}&message=${message}`,
      {
        target: "#last-message",
        swap: "innerHTML",
      }
    )
  }
}
