export const afterImageSwap = () => {
  const container = document.getElementById("main-image")
  const mainImage = container?.querySelector("img")

  if (mainImage?.complete) {
    container?.classList.remove("loading")
    return
  }

  container?.classList.remove("error")
  container?.classList.add("loading")

  mainImage?.addEventListener("load", () => {
    container?.classList.remove("loading")
  })

  mainImage?.addEventListener("error", () => {
    mainImage.src = mainImage.getAttribute("data-thumbnail") ?? ""
    container?.classList.remove("loading")
  })
}
