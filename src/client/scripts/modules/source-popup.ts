let timeoutId: number | null = null

const init = () => {
  const popups = document.querySelectorAll("[data-source-popup]")

  popups.forEach((popup) => {
    const parent = popup.parentElement ?? popup
    removeListeners(popup as HTMLElement, parent as HTMLElement)
    addListeners(popup as HTMLElement, parent as HTMLElement)
  })
}

const addListeners = (popup: HTMLElement, parent: HTMLElement) => {
  parent.addEventListener("mouseenter", () => {
    showPopup(popup as HTMLElement)
  })
  parent.addEventListener("mouseleave", () => {
    hidePopup(popup as HTMLElement)
  })
}

const removeListeners = (popup: HTMLElement, parent: HTMLElement) => {
  parent.removeEventListener("mouseenter", () => {
    showPopup(popup as HTMLElement)
  })
  parent.removeEventListener("mouseleave", () => {
    hidePopup(popup as HTMLElement)
  })
}

const showPopup = (popup: HTMLElement) => {
  timeoutId = setTimeout(() => {
    const parent = popup.parentElement ?? popup
    popup.classList.add("show")
    const parentRect = parent.getBoundingClientRect()
    const popupRect = popup.getBoundingClientRect()
    const top = parentRect.top - popupRect.height - 10
    const left = parentRect.left - popupRect.width / 2 + parentRect.width / 2
    if (top < 0) {
      popup.style.top = "10px"
      popup.style.left = `${parentRect.left - popupRect.width - 10}px`
    } else {
      popup.style.top = `${top}px`
      popup.style.left = `${left}px`
    }

  }, 300) as unknown as number
}

const hidePopup = (popup: HTMLElement) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  popup.classList.remove("show")
}

export default init
