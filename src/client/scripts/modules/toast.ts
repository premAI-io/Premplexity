export type ToastType = "success" | "error" | "info" | "loading" | "warning"

const iconNameMap: {
  [key in ToastType]: string
} = {
  success: `
  <path
    d="M7.155 18.334c-.326.001-.64-.152-.874-.427L.377 10.963a1.563 1.563 0 01-.276-.489c-.065-.183-.099-.38-.1-.58-.005-.402.123-.79.355-1.078.232-.288.55-.452.881-.457.332-.005.652.15.89.432l5.033 5.918 10.712-12.61c.238-.282.558-.437.89-.432.333.005.65.17.882.459.232.288.36.676.356 1.08a1.69 1.69 0 01-.378 1.068L8.03 17.907c-.234.275-.548.428-.875.427z"
    fill="currentColor"
  />
  `,
  error: `
  <path
    d="M10 0a10 10 0 1010 10A10.011 10.011 0 0010 0zm0 15a1 1 0 110-2.001A1 1 0 0110 15zm1-4a1 1 0 01-2 0V6a1 1 0 012 0v5z"
    fill="currentColor"
  />
  `,
  info: `
  <path d="M10 20C8.02219 20 6.08879 19.4135 4.4443 18.3147C2.79981 17.2159 1.51809 15.6541 0.761209 13.8268C0.00433284 11.9996 -0.1937 9.98891 0.192152 8.0491C0.578004 6.10929 1.53041 4.32746 2.92894 2.92894C4.32746 1.53041 6.10929 0.578004 8.0491 0.192152C9.98891 -0.1937 11.9996 0.00433284 13.8268 0.761209C15.6541 1.51809 17.2159 2.79981 18.3147 4.4443C19.4135 6.08879 20 8.02219 20 10C19.9971 12.6513 18.9426 15.1931 17.0679 17.0679C15.1931 18.9426 12.6513 19.9971 10 20ZM10 2C8.41775 2 6.87103 2.4692 5.55544 3.34825C4.23985 4.2273 3.21447 5.47673 2.60897 6.93854C2.00347 8.40034 1.84504 10.0089 2.15372 11.5607C2.4624 13.1126 3.22433 14.538 4.34315 15.6569C5.46197 16.7757 6.88743 17.5376 8.43928 17.8463C9.99113 18.155 11.5997 17.9965 13.0615 17.391C14.5233 16.7855 15.7727 15.7602 16.6518 14.4446C17.5308 13.129 18 11.5823 18 10C17.9976 7.879 17.154 5.84555 15.6542 4.34578C14.1544 2.84601 12.121 2.00239 10 2Z" fill="currentColor"/>
  <path d="M10 15C9.73479 15 9.48043 14.8946 9.2929 14.7071C9.10536 14.5196 9 14.2652 9 14V10H8C7.73479 10 7.48043 9.89465 7.2929 9.70711C7.10536 9.51957 7 9.26522 7 9C7 8.73479 7.10536 8.48043 7.2929 8.2929C7.48043 8.10536 7.73479 8 8 8H10C10.2652 8 10.5196 8.10536 10.7071 8.2929C10.8946 8.48043 11 8.73479 11 9V14C11 14.2652 10.8946 14.5196 10.7071 14.7071C10.5196 14.8946 10.2652 15 10 15Z" fill="currentColor"/>
  <path d="M12 15H8C7.73479 15 7.48043 14.8946 7.2929 14.7071C7.10536 14.5196 7 14.2652 7 14C7 13.7348 7.10536 13.4804 7.2929 13.2929C7.48043 13.1054 7.73479 13 8 13H12C12.2652 13 12.5196 13.1054 12.7071 13.2929C12.8946 13.4804 13 13.7348 13 14C13 14.2652 12.8946 14.5196 12.7071 14.7071C12.5196 14.8946 12.2652 15 12 15Z" fill="currentColor"/>
  <path d="M9.5 7C10.3284 7 11 6.32843 11 5.5C11 4.67158 10.3284 4 9.5 4C8.67158 4 8 4.67158 8 5.5C8 6.32843 8.67158 7 9.5 7Z" fill="currentColor"/>
  `,
  loading: `
  <path d="M18.7935 7.69003C19.2786 7.5626 19.5725 7.06416 19.4016 6.59262C19.0586 5.64638 18.5742 4.75567 17.9633 3.95143C17.169 2.90567 16.1765 2.0266 15.0425 1.36441C13.9084 0.702225 12.6551 0.269886 11.354 0.0920831C10.3533 -0.0446559 9.33952 -0.0287954 8.34691 0.137581C7.85225 0.220493 7.56259 0.721392 7.69002 1.20649V1.20649C7.81745 1.69158 8.31387 1.97618 8.81009 1.90326C9.57023 1.79155 10.3438 1.78721 11.108 1.89165C12.1728 2.03716 13.1986 2.39097 14.1266 2.93288C15.0547 3.4748 15.8669 4.19421 16.517 5.05003C16.9835 5.66425 17.3599 6.3401 17.6362 7.057C17.8166 7.525 18.3084 7.81746 18.7935 7.69003V7.69003Z" fill="currentColor"/>
  `,
  warning: `
  <path
    d="M10 0a10 10 0 1010 10A10.011 10.011 0 0010 0zm0 15a1 1 0 110-2.001A1 1 0 0110 15zm1-4a1 1 0 01-2 0V6a1 1 0 012 0v5z"
    fill="currentColor"
  />
  `
}

const createIconElement = (type: ToastType): HTMLDivElement => {
  const container = document.createElement("div")
  container.classList.add("icon")
  container.style.setProperty("--icon-size", "16")

  if (type === "loading") {
    container.classList.add("animate-spin")
  }

  const svgTemplate = `
  <svg
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
  >
    ${iconNameMap[type]}
  </svg>
  `


  container.innerHTML = svgTemplate
  return container
}

const createToast = (message: string, type: ToastType, autoRemove = true): HTMLDivElement => {
  const toastContainer = document.getElementById("toast")

  if (!toastContainer) {
    throw new Error("Toast container not found")
  }

  const toast = document.createElement("div")
  toast.classList.add("toast", `toast--${type}`)

  const iconContainer = document.createElement("div")
  iconContainer.classList.add("icon-container")
  const icon = createIconElement(type)
  iconContainer.appendChild(icon)
  toast.appendChild(iconContainer)

  const toastMessage = document.createElement("div")
  toastMessage.classList.add("toast__message")
  toastMessage.innerHTML = message
  toast.appendChild(toastMessage)

  toastContainer.appendChild(toast)

  if (autoRemove) {
    hideToast(toast)
  }

  return toast
}

const updateToast = (toast: HTMLDivElement, message: string, type?: ToastType) => {
  const toastMessage = toast.querySelector(".toast__message")
  if (!toastMessage) {
    throw new Error("Toast message not found")
  }

  toastMessage.innerHTML = message

  if (type) {
    toast.classList.remove("toast--success", "toast--error", "toast--info", "toast--loading", "toast--warning")
    toast.classList.add(`toast--${type}`)
    const icon = toast.querySelector(".icon")
    if (icon) {
      icon.remove()
      toast.prepend(createIconElement(type))
    }
  }
}

const hideToast = (toast: HTMLDivElement, timeout = 3000) => {
  setTimeout(() => {
    toast.classList.add("toast--hide")
    setTimeout(() => {
      toast.remove()
    }, 600)
  }, timeout)
}

export { createToast, updateToast, hideToast }
