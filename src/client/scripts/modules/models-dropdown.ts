export const onModelsDropdownSearch = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input) return
  const container = input.closest(".select__wrap")
  const inputHidden = container?.querySelector("input[type='hidden']") as HTMLInputElement | null
  if (inputHidden) {
    inputHidden.value = "0"
  }

  const options = Array.from(container?.querySelector(".dropdown__items")?.querySelectorAll(".dropdown__item") ?? []) as HTMLLIElement[]
  const search = input.value
  options.forEach((option) => {
    const label = option.textContent?.toLowerCase() || ""
    const value = option.getAttribute("data-value") || ""
    const provider = option.getAttribute("data-provider") || ""
    const valuesToSearch = [label, value.split("-").join(" "), provider]
    if (search === "" || valuesToSearch.some((v) => v.includes(search.toLowerCase()))) {
      option.style.display = "block"
    } else {
      option.style.display = "none"
    }
  })

  const providers = Array.from(container?.querySelectorAll("[data-provider-name]") ?? []) as HTMLDivElement[]
  providers.forEach((provider) => {
    const providerName = provider.getAttribute("data-provider-name") || ""
    const providerOptions = Array.from(container?.querySelectorAll(`[data-provider="${providerName}"]`) ?? []) as HTMLLIElement[]
    const visibleOptions = providerOptions.filter((option) => option.style.display !== "none")
    if (visibleOptions.length === 0) {
      provider.style.display = "none"
    } else {
      provider.style.display = "block"
    }
  })

  const visibleOptions = options.filter((option) => option.style.display !== "none")

  if (visibleOptions.length === 0) {
    const noResults = document.createElement("li")
    noResults.setAttribute("data-no-results", "true")
    noResults.classList.add("dropdown__item")
    const link = document.createElement("div")
    link.classList.add("dropdown__link")
    link.style.pointerEvents = "none"
    link.textContent = "No results found"
    noResults.appendChild(link)
    container?.querySelector(".dropdown__items")?.appendChild(noResults)
  } else {
    const noResults = container?.querySelectorAll("[data-no-results]")
    noResults?.forEach((el) => el.remove())
  }
}

export const onModelsDropdownSearchBlur = (value: string, options: string, id: string) => {
  const parsedOptions = JSON.parse(options) as Record<string, { label: string, value: string, selected: boolean }[]>
  if (!value || value.length === 0) {
    selectDefaultOption(id, parsedOptions)
  } else {
    let possibleOption = null
    for (const provider in parsedOptions) {
      possibleOption = parsedOptions[provider].find((option) => option.label.toString().toLowerCase() === value.toLowerCase())
      if (possibleOption) break
    }

    if (possibleOption) {
      window.onSelectSearchItemClick({ id, label: possibleOption.label.toString(), value: possibleOption.value.toString() })
    } else {
      selectDefaultOption(id, parsedOptions)
    }
  }
}

const selectDefaultOption = (id: string, options: Record<string, { label: string, value: string, selected: boolean }[]>) => {
  const initialValue = document.getElementById(id)?.getAttribute("data-value") || ""
  let selectedOption = null
  for (const provider in options) {
    selectedOption = options[provider].find((option) => option.value === initialValue)
    if (selectedOption) break
  }
  if (!selectedOption) {
    selectedOption = options[Object.keys(options)[0]][0]
  }
  window.onSelectSearchItemClick({ id, label: selectedOption.label.toString(), value: selectedOption.value.toString() })
}
