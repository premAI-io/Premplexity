import { createSourcePopupElement } from "$utils/thread"

const init = () => {
  const triggers = document.querySelectorAll("[data-source-popup]")
  document.getElementById("thread-body")?.parentNode?.addEventListener("scroll", () => {
    document.querySelectorAll(".source-popup__container").forEach(popup => popup.remove())
  })
  triggers.forEach((trigger) => {
    new SourcePopup(trigger as HTMLElement)
  })
}

class SourcePopup {
  private popup: HTMLElement
  private parent: HTMLElement

  constructor(parent: HTMLElement) {
    const popupData = JSON.parse(
      (parent.getAttribute("data-source-popup") as string)
      .replace(/\n/g, "\\n")
      .replace(/&quot;/g, "\"")
    )
    this.popup = createSourcePopupElement(popupData)
    this.parent = parent
    this.addListeners()
  }

  private removeListeners = () => {
    this.parent.removeEventListener("mouseenter", this.showPopup)
    this.parent.removeEventListener("mouseleave", this.hidePopup)
  }

  private addListeners = () => {
    if (this.parent.getAttribute("data-source-popup-listener") === "true") {
      this.removeListeners()
    }
    this.parent.addEventListener("mouseenter", this.showPopup)
    this.parent.addEventListener("mouseleave", this.hidePopup)
    this.parent.setAttribute("data-source-popup-listener", "true")
  }

  private showPopup = () => {
    this.parent.insertAdjacentElement("afterend", this.popup)
    const parentRect = this.parent.getBoundingClientRect()
    const top = parentRect.top - 167 - 10
    const left = parentRect.left - 237 / 2 + parentRect.width / 2
    if (top < 0) {
      this.popup.style.top = "10px"
      this.popup.style.left = `${parentRect.left - 237 - 10}px`
    } else {
      this.popup.style.top = `${top}px`
      this.popup.style.left = `${left}px`
    }
  }

  private hidePopup = () => {
    this.popup.remove()
  }
}

export default init
