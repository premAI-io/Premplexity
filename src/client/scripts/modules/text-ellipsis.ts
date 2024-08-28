const filterOutTags = [
  "SCRIPT", "STYLE", "NOSCRIPT", "IFRAME",
  "OBJECT", "AUDIO", "VIDEO", "CANVAS", "EMBED",
  "SVG", "IMG", "INPUT", "TEXTAREA", "SELECT",
  "OPTION", "OPTGROUP", "BUTTON", "LINK",
  "META", "BASE", "AREA", "BASEFONT",
  "BR", "COL", "FRAME", "HR", "PARAM",
  "SOURCE", "TRACK", "WBR"
]

const isOverflowing = (element: HTMLElement): boolean => {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
}

const addTooltip = (element: HTMLElement): void => {
  if (isOverflowing(element)) {
    element.setAttribute("data-tooltip-text", element.innerText)

    element.addEventListener("mouseover", () => {
      const oldStyle = document.getElementById("tooltip-style")
      if (oldStyle) {
        oldStyle.remove()
      }

      const style = document.createElement("style")
      style.id = "tooltip-style"

      const elementRect = element.getBoundingClientRect()
      const elementWidth = elementRect.width
      const elementTop = elementRect.top
      const elementLeft = elementRect.left

      style.innerHTML = `
        *[data-tooltip-text]:after {
          top: ${elementTop}px;
          left: ${elementLeft + elementWidth / 2}px;
        }
      `
      document.head.appendChild(style)
    })

    element.addEventListener("mouseout", () => {
      const oldStyle = document.getElementById("tooltip-style")
      if (oldStyle) {
        oldStyle.remove()
      }
    })
  }
}

export const initTextEllipsis = (): void => {
  const parser = new DOMParser()

  let elements = Array.from(document.querySelectorAll("*"))
  elements = elements.filter((element) => {
    if (element.childElementCount !== 0) {
      return false
    }

    const parsedInnerHTML = parser.parseFromString(element.innerHTML, "text/html").body.innerText

    return (
      element instanceof HTMLElement &&
      !filterOutTags.includes(element.tagName) &&
      !element.closest("[text-ellipsis-exclude]") &&
      parsedInnerHTML.toLowerCase() === element.innerText.toLowerCase() &&
      element.innerText.length > 0
    )
  })

  elements.forEach((element) => {
    addTooltip(element as HTMLElement)
  })
}
