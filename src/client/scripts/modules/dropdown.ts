import htmx from "htmx.org"
import { getElement } from "../helpers"

const DEFAULT_OFFSET = 10
const ALLOWED_POSITIONS = ["top", "top-left", "top-right", "right", "right-top", "right-bottom", "bottom", "bottom-left", "bottom-right", "left", "left-top", "left-bottom"] as const
const HORIZONTAL_POSITIONS = ["left", "left-top", "left-bottom", "right", "right-top", "right-bottom"] as const
const VERTICAL_POSITIONS = ["top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right"] as const

export type DropdownPosition = typeof ALLOWED_POSITIONS[number]
type DropdownHorizontalPosition = typeof HORIZONTAL_POSITIONS[number]
type DropdownVerticalPosition = typeof VERTICAL_POSITIONS[number]

const DEFAULT_POSITION: DropdownPosition = "bottom"

const getDropdownOptions = (element: HTMLElement) => {
  const position = ALLOWED_POSITIONS.includes(element.getAttribute("data-position") as DropdownPosition)
    ? element.getAttribute("data-position") as DropdownPosition
    : DEFAULT_POSITION
  const inheritWidth = element.hasAttribute("data-inherit-width")
  const cloneOnOpen = element.hasAttribute("data-clone")
  const relative = element.hasAttribute("data-relative")
  const relativeAttr = element.getAttribute("data-relative")
  const relativeElement = relativeAttr ? getElement(relativeAttr) : null
  const offsetAttr = parseInt(element.getAttribute("data-offset") as string)
  const offset = !isNaN(offsetAttr) ? offsetAttr : DEFAULT_OFFSET

  return { position, inheritWidth, cloneOnOpen, relative, relativeElement, offset }
}

const handleHorizontalPosition = (toggleRect: DOMRect, elRect: DOMRect, position: DropdownVerticalPosition, relative: boolean) => {
  const pos = position.split("-")[1] || "center"
  switch (pos) {
    default:
    case "center":
      return (relative ? 0 : toggleRect.left) + toggleRect.width * 0.5 - elRect.width * 0.5
    case "right":
      return (relative ? 0 : toggleRect.left) + toggleRect.width - elRect.width
    case "left":
      return (relative ? 0 : toggleRect.left)
  }
}

const handleVerticalPosition = (toggleRect: DOMRect, elRect: DOMRect, position: DropdownHorizontalPosition) => {
  const pos = position.split("-")[1] || "center"
  switch (pos) {
    default:
    case "center":
      return toggleRect.top + toggleRect.height * 0.5 - elRect.height * 0.5
    case "top":
      return toggleRect.top + toggleRect.height - elRect.height
    case "bottom":
      return toggleRect.top
  }
}

const setDropdownPosition = (toggle: HTMLElement, dropdown: HTMLElement, clone?: HTMLElement) => {
  const { position, inheritWidth, relative, relativeElement, offset } = getDropdownOptions(dropdown)

  const toggleRect = (relativeElement || toggle).getBoundingClientRect()
  const { top: toggleTop, left: toggleLeft, height: toggleHeight, width: toggleWidth } = toggleRect

  if (inheritWidth) {
    dropdown.style.width = `${toggleWidth}px`
    if (clone) {
      clone.style.width = `${toggleWidth}px`
    }
  }

  const elRect = dropdown.getBoundingClientRect()
  const { height: elHeight, width: elWidth } = elRect

  let top = 0
  let left = 0
  let viewportTop = 0
  let viewportLeft = 0

  switch (position) {
    default:
    case "bottom":
    case "bottom-left":
    case "bottom-right":
      top = (relative ? 0 : toggleTop) + toggleHeight + offset
      viewportTop = toggleTop + toggleHeight + offset
      left = handleHorizontalPosition(toggleRect, elRect, position, relative)
      viewportLeft = left
      break
    case "top":
    case "top-left":
    case "top-right":
      top = (relative ? 0 : toggleTop) - elHeight - offset
      viewportTop = toggleTop - elHeight - offset
      left = handleHorizontalPosition(toggleRect, elRect, position, relative)
      viewportLeft = left
      break
    case "right":
    case "right-top":
    case "right-bottom":
      left = (relative ? 0 : toggleLeft) + toggleWidth + offset
      viewportLeft = toggleLeft + toggleWidth + offset
      top = handleVerticalPosition(toggleRect, elRect, position)
      viewportTop = top
      break
    case "left":
    case "left-top":
    case "left-bottom":
      left = (relative ? 0 : toggleLeft) - elWidth - offset
      viewportLeft = toggleLeft - elWidth - offset
      top = handleVerticalPosition(toggleRect, elRect, position)
      viewportTop = top
      break
  }

  const wW = window.innerWidth
  const wH = window.innerHeight

  if (viewportTop + elHeight > wH) {
    if (position.startsWith("bottom")) {
      top = (relative ? 0 : toggleTop) - elHeight - offset
      dropdown.setAttribute("data-position-top", "true")
    } else {
      top = wH - elHeight - offset
    }
  } else if (viewportTop < 0) {
    if (position.startsWith("top")) {
      top = (relative ? 0 : toggleTop) + toggleHeight + offset
    } else {
      top = offset
    }
  }

  if (viewportLeft + elWidth > wW) {
    if (position.startsWith("right")) {
      left = (relative ? 0 : toggleLeft) - elWidth - offset
    } else {
      left = wW - elWidth - offset
    }
  } else if (viewportLeft < 0) {
    if (position.startsWith("left")) {
      left = (relative ? 0 : toggleLeft) + toggleWidth + offset
    } else {
      left = offset
    }
  }

  if (clone) {
    clone.style.top = `${top}px`
    clone.style.left = `${left}px`
  } else {
    dropdown.style.top = `${top}px`
    dropdown.style.left = `${left}px`
  }
}

window.openDropdown = (dropdownId: string, referenceComponent?: HTMLElement) => {
  const dropdown = document.getElementById(dropdownId)
  if (dropdown) {
    let element

    const cloneOnOpen = dropdown.hasAttribute("data-clone")
    if (cloneOnOpen) {
      element = dropdown.cloneNode(true) as HTMLElement
      element.id = dropdownId + "-clone"
      element.setAttribute("data-clone", "cloned")
      document.body.appendChild(element)
      htmx.process(element)
    } else {
      element = dropdown
    }
    const ref = referenceComponent ? referenceComponent : dropdown.getAttribute("data-reference") ? document.getElementById(dropdown.getAttribute("data-reference") as string) as HTMLElement : dropdown.previousElementSibling as HTMLElement
    setDropdownPosition(ref, dropdown, cloneOnOpen ? element : undefined)
    element.classList.add("dropdown--open")
  }
}

window.closeDropdown = (dropdownId: string) => {
  const dropdown = document.getElementById(dropdownId)
  const trigger = document.querySelector(`[data-dropdown-toggle="${dropdownId}"]`)
  if (trigger && trigger.getAttribute("data-hide-on-clickaway")) {
    trigger.classList.remove("!flex")
  }

  if (dropdown) {
    if (dropdown.hasAttribute("data-clone")) {
      const clone = document.getElementById(dropdownId + "-clone")
      if (clone) {
        clone.remove()
      }
    }
    dropdown.classList.remove("dropdown--open")
  }
}

window.toggleDropdown = (e: MouseEvent, dropdownId: string) => {
  e.stopPropagation()
  e.preventDefault()

  window.closeDropdowns(document.body, dropdownId)

  const dropdown = document.getElementById(dropdownId)
  const trigger = document.querySelector(`[data-dropdown-toggle="${dropdownId}"]`)
  if (trigger && trigger.getAttribute("data-hide-on-clickaway")) {
    trigger.classList.add("!flex")
  }
  if (dropdown) {
    const isOpen = dropdown.hasAttribute("data-clone") ? !!document.getElementById(dropdownId + "-clone") : dropdown.classList.contains("dropdown--open")
    if (isOpen) {
      window.closeDropdown(dropdownId)
    } else {
      window.openDropdown(dropdownId)
    }
  }
}

window.onDropdownResize = () => {
  const dropdowns = document.querySelectorAll(".dropdown--open")
  dropdowns.forEach((dropdown) => {
    const toggle = document.querySelector(`[data-dropdown-toggle="${dropdown.id}"]`) as HTMLElement
    const clone = document.getElementById(dropdown.id + "-clone") ?? undefined
    const ref = dropdown.getAttribute("data-reference") ? document.getElementById(dropdown.getAttribute("data-reference") as string) as HTMLElement : toggle
    setDropdownPosition(ref, dropdown as HTMLElement, clone)
  })
}

window.closeDropdowns = (container = document.body, exclude?: string) => {
  const dropdowns = container.querySelectorAll(".dropdown")
  dropdowns.forEach((dropdown) => {
    if (dropdown.id !== exclude) {
      if (dropdown.classList.contains("dropdown--open") || document.querySelector(`#${dropdown.id}-clone`)) {
        window.closeDropdown(dropdown.id)
      }
    }
  })
}
