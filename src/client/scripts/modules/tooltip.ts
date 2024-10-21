export const initTooltips = () => {
  const containers = document.querySelectorAll(".tooltip__container")
  containers.forEach((container) => {
    removeListeners(container as HTMLElement)
    const tooltip = container.querySelector(".tooltip") as HTMLElement

    container.addEventListener("mouseenter", () => {
      setTooltipToFixed(tooltip)
    })

    container.addEventListener("mouseleave", () => {
      removeClone()
    })
  })
}

const removeListeners = (container: HTMLElement) => {
  const tooltip = container.querySelector(".tooltip") as HTMLElement

  container.removeEventListener("mouseenter", () => {
    setTooltipToFixed(tooltip)
  })

  container.removeEventListener("mouseleave", () => {
    removeClone()
  })
}

const setTooltipToFixed = (tooltip: HTMLElement) => {
  const container = tooltip.closest(".tooltip__container") as HTMLElement
  const containerRect = container.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const width = tooltipRect.width
  const top = containerRect.top - 10
  const left = containerRect.left + (containerRect.width / 2) - (width / 2)

  const clone = tooltip.cloneNode(true) as HTMLElement

  clone.style.top = `${top}px`
  clone.style.left = `${left}px`

  clone.setAttribute("data-appeared-time", `${Date.now()}`)

  setTimeout(() => {
    clone.classList.add("tooltip--show")
  }, 300)

  document.getElementById("tooltip")?.appendChild(clone)
}

const removeClone = (checkDelay?: boolean) => {
  document.getElementById("tooltip")?.querySelectorAll(".tooltip").forEach((tooltip) => {
    let canRemove = true
    if (checkDelay) {
      const appearedTime = parseInt(tooltip.getAttribute("data-appeared-time") as string)
      if (Date.now() - appearedTime < 300) {
        canRemove = false
      }
    }
    if (canRemove) {
      tooltip.remove()
    }
  })
}
