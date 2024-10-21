type LoaderObject = {
  show: () => void
  hide: () => void
  isReady: () => boolean
}

const show = (): void => {
  const loader = document.getElementById("loader")
  if (loader) {
    loader.classList.add("active")
  }
}

const hide = (): void => {
  const loader = document.getElementById("loader")
  if (loader) {
    loader.classList.remove("active")
  }
}

const isReady = (): boolean => {
  return !!document.getElementById("loader")
}

export const loader: LoaderObject = {
  show, hide, isReady
}
