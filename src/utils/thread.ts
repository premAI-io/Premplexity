import { Page, Image } from "$components/SerpAPI"
import { SearchCallbackParams } from "$components/ThreadCore"

// --------------- SOURCE CARD TEMPLATES ---------------

export const createSourceCard = (source: Page) => {
  const template = `
    <div class="source-card__container cursor-pointer" text-ellipsis-exclude onclick="window.open('${source.link}', '_blank')" data-source-popup="${JSON.stringify(source).replace(/"/g, "&quot;")}" >
      <div class="source-card__content" safe>
        ${source.snippet}
      </div>
      <div class="source-card__footer">
        <div class="source-card__image">
          <img src="${source.favicon ?? "https://via.placeholder.com/150"}" class="h-full w-full object-center object-cover" />
        </div>
        <div class="source-card__source" safe>
          ${source.link}
        </div>
        <div class="source-card__id">
          ${source.order}
        </div>
      </div>
    </div>
  `

  return template
}

export const createSourcePopup = (source: Page) => {
  return `
    <div class="source-popup__container" text-ellipsis-exclude>
      <div class="flex gap-2 items-center">
        <div class="source-card__image shrink-0">
          <img src="${source.favicon ?? "https://via.placeholder.com/150"}" alt="${source.title}" class="h-full w-full object-center object-cover">
        </div>
        <div class="flex flex-1 gap-1 items-center">
          <div class="text-xs text-gray-200 font-semibold truncate max-w-[170px]">
            ${source.link}
          </div>
          <div class="source-card__id shrink-0">${source.order}</div>
        </div>
      </div>
      <div class="source-popup__title">
        ${source.title}
      </div>
      <div class="source-popup__snippet">
        ${source.snippet}
      </div>
    </div>
  `
}

export const createSourcePopupElement = (source: Page) => {
  const container = document.createElement("div")
  container.classList.add("source-popup__container")
  container.setAttribute("text-ellipsis-exclude", "")

  const imageContainer = document.createElement("div")
  imageContainer.classList.add("flex", "gap-2", "items-center")
  container.appendChild(imageContainer)

  const image = document.createElement("div")
  image.classList.add("source-card__image", "shrink-0")
  image.innerHTML = `<img src="${source.favicon ?? "https://via.placeholder.com/150"}" alt="${source.title}" class="h-full w-full object-center object-cover">`
  imageContainer.appendChild(image)

  const textContainer = document.createElement("div")
  textContainer.classList.add("flex", "flex-1", "gap-1", "items-center")
  imageContainer.appendChild(textContainer)

  const link = document.createElement("div")
  link.id = "source-popup-link"
  link.classList.add("text-xs", "text-gray-200", "font-semibold", "truncate", "max-w-[170px]")
  link.setAttribute("safe", "")
  link.innerText = source.link
  textContainer.appendChild(link)

  const id = document.createElement("div")
  id.classList.add("source-card__id", "shrink-0")
  id.innerText = source.order.toString()
  textContainer.appendChild(id)

  const title = document.createElement("div")
  title.classList.add("source-popup__title")
  title.setAttribute("safe", "")
  title.innerText = source.title
  container.appendChild(title)

  const snippet = document.createElement("div")
  snippet.classList.add("source-popup__snippet")
  snippet.setAttribute("safe", "")
  snippet.innerText = source.snippet
  container.appendChild(snippet)

  return container
}


export const createViewMoreCard = ({
  targetThreadId,
  targetMessageId
}: {
  targetThreadId: number,
  targetMessageId: number
}) => {
  return `
    <div
      class="source-card__container bg-gray-600 cursor-pointer !justify-between !p-0"
      hx-get="/partials/thread/${targetThreadId}/${targetMessageId}/sources-modal"
      hx-target="#modal"
      hx-swap="innerHTML"
    >
      <div class="text-left pt-[8.5px] pl-[4.75px]">
        <svg width="16" height="16" viewBox="0 0 20 20" role="img"><use href="#book"></use></svg>
      </div>
      <div class="text-right pb-1 pr-2 text-xs">
        View more
      </div>
    </div>
  `
}

// --------------- IMAGE CARD TEMPLATES ---------------

export const createImageCard = ({
  targetThreadId,
  targetMessageId,
  image
}: {
  targetThreadId: number,
  targetMessageId: number,
  image: Image
}) => {
  const template = `
    <div
      class="image-card-container"
      hx-get="/partials/thread/${targetThreadId}/${targetMessageId}/${image.order}/images-listing"
      hx-target="#modal"
      hx-swap="innerHTML"
    >
      <img src="${image.thumbnail}" class="h-full w-full object-center object-cover" />
    </div>
  `

  return template
}

// --------------- ASSISTANT RESPONSE ---------------

export const parseAssistantResponse = (response: string) => {
  //Replace new lines with <br> tags. Not replacing new lines when they are preceded by a closing tag or followed by an opening tag or surrounded by spaces
  const regex = /(?<!\/|>)\n(?!<|\s)/g
  return response.replace(regex, "<br>")
}

export const insertSourcePopup = (text: string, sources: Page[]) => {
  const regex = /<a[^>]*class="source"[^>]*>.*?<\/a>/g
  const matches = text.match(regex)
  if (!matches) {
    return text
  }

  matches.forEach(match => {
    const regex = />(.*?)</
    const innerText = match.match(regex)
    if (!innerText) {
      return
    }

    const source = sources.find(source => source.order === parseInt(innerText[1]))
    if (!source) {
      return
    }

    // set attribute to match
    const el = match.replace(">", ` data-source-popup="${JSON.stringify(source).replace(/"/g, "&quot;")}" >`)

    text = text.replace(match, el)
  })

  return text
}

// --------------- SUGGESTIONS ---------------

export const createSuggestionsSection = (suggestions: Extract<SearchCallbackParams, { type: "followUpQuestions" }>["data"], threadId: number) => {
  return `
    <div id="follow-up-questions" class="grid gap-[10px] w-full">
      <div class="text-gray-500 text-base text-left">Suggestions</div>
      ${suggestions.filter(suggestion => suggestion.length > 0).map(suggestion => (
        `
          <div
            class="suggestion-item"
            hx-post="/actions/thread/${threadId}/sendMessage"
            hx-headers='{"HX-Disable-Loader": "true"}'
            hx-vals='{"message": "${suggestion}"}'
            hx-target="#thread-body"
            hx-swap="afterbegin"
            hx-push-url="false"
            hx-on::before-request="onPromptSubmit({ newMessageInserted: true })"
          >
            ${suggestion}
          </div>
        `
      )).join("")}
    </div>
  `
}
