import { SearchCallbackParams } from "$components/ThreadCore"
import { parseAssistantResponse, createImageCard, createSourceCard, createViewMoreCard, insertSourcePopup } from "$utils/thread"
import initSourcesPopup from "src/client/scripts/modules/source-popup"
import { SearchResults } from "$components/SerpAPI"

export type ThreadSSEMessage = {
  threadId: number,
  content: SearchCallbackParams
}

const getThreadContainer = (threadId: number): HTMLElement | null => {
  const container = document.getElementById("thread-body")
  if (!container) {
    return null
  }

  const currentThreadId = container.getAttribute("data-thread-id")
  if (!currentThreadId || parseInt(currentThreadId) !== threadId) {
    return null
  }

  return container
}

export const handleThreadSSEMessage = (
  message: ThreadSSEMessage
) => {
  const { threadId, content } = message

  const threadContainer = getThreadContainer(threadId)
  if (!threadContainer) {
    return
  }

  switch (content.type) {
    case "searchSources": {
      // ----------------- SOURCES -----------------
      const mainSourcesContainer = threadContainer.querySelector("#thread-sources-container[data-current-message]")
      if (!mainSourcesContainer) {
        return
      }
      const sourceLoadersContainer = mainSourcesContainer.querySelector("#thread-sources-loader")
      const sourcesContainer = mainSourcesContainer.querySelector("#thread-sources")
      if (!sourcesContainer || !sourceLoadersContainer) {
        return
      }

      sourceLoadersContainer.classList.add("!hidden")
      sourcesContainer.classList.remove("!hidden")

      const sources = content.data.pages
      if (sources.length > 5) {
        sources.slice(0, 4).forEach(source => {
          const sourceCard = createSourceCard(source)
          sourcesContainer.insertAdjacentHTML("beforeend", sourceCard)
        })
        const viewMoreCard = createViewMoreCard()
        sourcesContainer.insertAdjacentHTML("beforeend", viewMoreCard)
      } else {
        sources.forEach(source => {
          const sourceCard = createSourceCard(source)
          sourcesContainer.insertAdjacentHTML("beforeend", sourceCard)
        })
      }
      initSourcesPopup()

      // ----------------- IMAGES -----------------
      if (content.data.images.length > 0) {
        const titleContainer = document.createElement("div")
        titleContainer.id = "thread-images-title"
        titleContainer.classList.add("font-semibold", "mt-4", "text-sm", "text-left")
        titleContainer.innerText = "Related images"
        sourcesContainer.insertAdjacentElement("afterend", titleContainer)

        const imagesMainContainer = document.createElement("div")
        imagesMainContainer.id = "thread-images-container"
        imagesMainContainer.classList.add("pt-2")
        const imagesContainer = document.createElement("div")
        imagesContainer.id = "thread-images"
        imagesContainer.classList.add("thread_images_grid")
        imagesMainContainer.appendChild(imagesContainer)
        titleContainer.insertAdjacentElement("afterend", imagesMainContainer)

        const images = content.data.images
        images.slice(0, 6).forEach(image => {
          const imageCard = createImageCard(image)
          imagesContainer.insertAdjacentHTML("beforeend", imageCard)
        })
      }

      break
    }
    case "completionChunk": {
      const container = threadContainer.querySelector("#thread-text-container[data-current-message]")
      if (!container) {
        return
      }
      const textLoadersContainer = container.querySelector("#thread-text-loader")
      const textContainer = container.querySelector("#thread-text")
      if (!textContainer || !textLoadersContainer) {
        return
      }

      textLoadersContainer.classList.add("!hidden")
      textContainer.classList.remove("!hidden")


      const text = content.data
      textContainer.innerHTML += text

      const completeText = (textContainer.getAttribute("data-text") ?? "").replace(/&lt;/g, "<").replace(/&gt;/g, ">") + text
      textContainer.setAttribute("data-text", completeText)

      // regex for unclosed tags
      const regex = /<([a-z]+)(?: .+?)?(?<!\/)>/g
      const tags = completeText.match(regex)

      if (tags) {
        const lastTag = tags[tags.length - 1]
        if (!lastTag.includes("/")) {
          break
        }
      }

      textContainer.innerHTML = (textContainer.getAttribute("data-text") ?? "").replace(/&lt;/g, "<").replace(/&gt;/g, ">")

      break
    }
    case "followUpQuestions": {
      console.log("followUpQuestions", content)
      break
    }
    case "end": {
      const container = threadContainer.querySelector("#thread-text-container[data-current-message]")
      if (!container) {
        return
      }
      const textLoadersContainer = container.querySelector("#thread-text-loader")
      const textContainer = container.querySelector("#thread-text")
      if (!textContainer || !textLoadersContainer) {
        return
      }

      textLoadersContainer.classList.add("!hidden")
      textContainer.classList.remove("!hidden")

      const text = content.data.content
      if (text) {
        if (Object.keys(content.data.sources).includes("searchSources")) {
          textContainer.innerHTML = insertSourcePopup(textContainer.innerHTML, (content.data.sources as { searchSources: SearchResults }).searchSources.pages)
        } else {
          textContainer.innerHTML = text
        }
        textContainer.removeAttribute("data-text")
        const copyButton = container.querySelector("#copy-response-button")
        if (copyButton) {
          const el = copyButton.querySelector("button")
          if (el) {
            el.setAttribute("data-value", parseAssistantResponse(text))
            el.removeAttribute("disabled")
            el.classList.remove("opacity-50")
          }
        }
      } else if (content.data.error) {
        textContainer.classList.add("text-red-500")
        textContainer.innerHTML = content.data.error
      }

      initSourcesPopup()
      const currentMessages = threadContainer.querySelectorAll("[data-current-message]")
      currentMessages.forEach(message => {
        message.removeAttribute("data-current-message")
      })
      break
    }
    default: {
      break
    }
  }
}
