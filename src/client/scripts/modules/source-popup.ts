const init = () => {
  const popups = document.querySelectorAll("[data-source-popup]")

  popups.forEach((popup) => {
    const parent = popup.parentElement
    if (!parent) {
      return
    }
    new SourcePopup(popup as HTMLElement, parent)
  })
}

class SourcePopup {
  private popup: HTMLElement
  private parent: HTMLElement
  private timeoutId: number | null = null

  constructor(popup: HTMLElement, parent: HTMLElement) {
    this.popup = popup
    this.parent = parent
    this.addListeners()
  }

  private addListeners = () => {
    if (this.parent.getAttribute("data-source-popup-listener") === "true") {
      return
    }
    this.parent.addEventListener("mouseenter", this.showPopup)
    this.parent.addEventListener("mouseleave", this.hidePopup)
    this.parent.setAttribute("data-source-popup-listener", "true")
  }

  private showPopup = () => {
    this.timeoutId = setTimeout(() => {
      this.popup.classList.add("show")
      const parentRect = this.parent.getBoundingClientRect()
      const popupRect = this.popup.getBoundingClientRect()
      const top = parentRect.top - popupRect.height - 10
      const left = parentRect.left - popupRect.width / 2 + parentRect.width / 2
      if (top < 0) {
        this.popup.style.top = "10px"
        this.popup.style.left = `${parentRect.left - popupRect.width - 10}px`
      } else {
        this.popup.style.top = `${top}px`
        this.popup.style.left = `${left}px`
      }
    }, 300) as unknown as number
  }

  private hidePopup = () => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    this.popup.classList.remove("show")
  }
}

export default init
