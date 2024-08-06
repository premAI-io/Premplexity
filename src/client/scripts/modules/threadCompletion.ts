import { SearchCallbackParams } from "$components/ThreadCore"
import { createImageCard, createSourceCard, createSuggestionsSection, createSuggestionsSkeleton, createViewMoreCard, insertSourcePopup } from "$utils/thread"
import initSourcesPopup from "src/client/scripts/modules/source-popup"
import { SearchResults } from "$components/SerpAPI"
import { addPreCopyButtons, markdownToHTML } from "src/client/scripts/modules/markdown"
import htmx from "htmx.org"

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

  const lastMessageContainer = document.getElementById("last-message")
  if (!lastMessageContainer) {
    return
  }

  switch (content.type) {
    case "improvedQuery": {
      const children = lastMessageContainer.querySelectorAll("[data-current-message]")
      children.forEach(child => {
        const value = child.getAttribute("data-current-message")
        if (value === "0") {
          child.setAttribute("data-current-message", content.data.messageId.toString())
        }
      })
      break
    }
    case "searchSources": {
      const children = lastMessageContainer.querySelectorAll("[data-current-message]")
      children.forEach(child => {
        const value = child.getAttribute("data-current-message")
        if (value === "0") {
          child.setAttribute("data-current-message", content.data.messageId.toString())
        }
      })
      // ----------------- SOURCES -----------------
      const mainSourcesContainer = threadContainer.querySelector("#thread-sources-container[data-current-message='" + content.data.messageId + "']")
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
        const viewMoreCard = createViewMoreCard({
          targetThreadId: threadId,
          targetMessageId: content.data.messageId
        })
        sourcesContainer.insertAdjacentHTML("beforeend", viewMoreCard)
      } else {
        if (sources.length === 0) {
          const sourceTitle = threadContainer.querySelector("#thread-sources-title")
          if (sourceTitle) {
            sourceTitle.classList.add("!hidden")
          }
          mainSourcesContainer.classList.add("!hidden")
        }
        sources.forEach(source => {
          const sourceCard = createSourceCard(source)
          sourcesContainer.insertAdjacentHTML("beforeend", sourceCard)
        })
      }
      initSourcesPopup()
      htmx.process(sourcesContainer)

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
          const imageCard = createImageCard({
            targetThreadId: threadId,
            targetMessageId: content.data.messageId,
            image
          })
          imagesContainer.insertAdjacentHTML("beforeend", imageCard)
        })
        htmx.process(imagesContainer)
      } else {
        const titleContainer = document.getElementById("thread-images-title")
        if (titleContainer) {
          titleContainer.remove()
        }
        const imagesContainer = document.getElementById("thread-images-container")
        if (imagesContainer) {
          imagesContainer.remove()
        }
      }

      break
    }
    case "completionChunk": {
      const container = threadContainer.querySelector("#thread-text-container[data-current-message='" + content.data.messageId + "']")
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


      const text = content.data.data
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

      textContainer.innerHTML = markdownToHTML((textContainer.getAttribute("data-text") ?? "").replace(/&lt;/g, "<").replace(/&gt;/g, ">"))

      const copyButton = container.querySelector("#copy-response-button")
      if (copyButton) {
        const el = copyButton.querySelector("button")
        el?.setAttribute("data-value", textContainer.textContent ?? "")
      }
      initSourcesPopup()
      addPreCopyButtons()
      break
    }
    case "startFollowUpQuestions": {
      const lastMessageContainer = document.getElementById("last-message")
      if (!lastMessageContainer) {
        return
      }

      const children = lastMessageContainer.querySelectorAll("[data-current-message]")
      const stopped = !(Array.from(children).some(child => {
        return child.getAttribute("data-current-message") === content.data.messageId.toString()
      }))
      if (stopped) {
        return
      }

      const container = createSuggestionsSkeleton()
      lastMessageContainer.insertAdjacentHTML("beforeend", container)

      break
    }
    case "followUpQuestions": {
      const lastMessageContainer = document.getElementById("last-message")
      if (!lastMessageContainer) {
        return
      }

      const children = lastMessageContainer.querySelectorAll("[data-current-message]")
      const stopped = !(Array.from(children).some(child => {
        return child.getAttribute("data-current-message") === content.data.messageId.toString()
      }))
      if (stopped) {
        return
      }

      const container = createSuggestionsSection(content.data, threadId)

      const loaderContainer = lastMessageContainer.querySelector("#follow-up-questions-loading")
      loaderContainer?.remove()

      lastMessageContainer.insertAdjacentHTML("beforeend", container)
      htmx.process(lastMessageContainer)
      break
    }
    case "end": {
      const container = threadContainer.querySelector("#thread-text-container[data-current-message='" + content.data.messageId + "']")
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

      let text = content.data.content
      if (text) {
        text = markdownToHTML(text)
        if (Object.keys(content.data.sources).includes("searchSources")) {
          textContainer.innerHTML = insertSourcePopup(text, (content.data.sources as { searchSources: SearchResults }).searchSources.pages)
        } else {
          textContainer.innerHTML = text
        }
        textContainer.removeAttribute("data-text")
        const copyButton = container.querySelector("#copy-response-button")
        if (copyButton) {
          const el = copyButton.querySelector("button")
          el?.setAttribute("data-value", textContainer.textContent ?? "")
        }
      } else if (content.data.error) {
        textContainer.classList.add("text-red-500")
        textContainer.innerHTML = content.data.error

        if (content.data.hasMoreErrorData) {
          const seeMoreLink = document.createElement("a")
          seeMoreLink.classList.add("hover:underline")
          seeMoreLink.href = `/partials/thread/${threadId}/${content.data.messageId}/error-modal`
          seeMoreLink.setAttribute("hx-target", "#modal")
          seeMoreLink.setAttribute("hx-swap", "innerHTML")
          seeMoreLink.setAttribute("hx-push-url", "false")
          seeMoreLink.setAttribute("hx-boost", "true")
          seeMoreLink.innerText = "See more details"
          const span = document.createElement("span")
          span.innerText = ". "
          textContainer.appendChild(span)
          textContainer.appendChild(seeMoreLink)
          htmx.process(textContainer)
        }
      }
      initSourcesPopup()
      addPreCopyButtons()
      const redoButton = container.querySelector("#redo-button")
      if (redoButton) {
        redoButton.removeAttribute("disabled")
      }
      const currentMessages = threadContainer.querySelectorAll("[data-current-message='" + content.data.messageId + "']")
      currentMessages.forEach(message => {
        message.removeAttribute("data-current-message")
      })

      const loaderContainer = lastMessageContainer.querySelector("#follow-up-questions-loading")
      loaderContainer?.remove()

      updateSidebarItem(threadContainer, threadId)

      const inputPrompt = document.getElementById("input-prompt-inner-container") as HTMLTextAreaElement | null
      inputPrompt?.parentNode?.querySelector("#input-prompt-submit")?.setAttribute("disabled", "true")
      inputPrompt?.removeAttribute("data-response-loading")

      document.getElementById("edit-message-button")?.removeAttribute("disabled")
      break
    }
    default: {
      break
    }
  }
}

export const formatMarkdown = () => {
  const containers = document.querySelectorAll("#thread-text-container")
  containers.forEach(container => {
    const textContainer = container.querySelector("#thread-text")
    if (textContainer) {
      if (textContainer.getAttribute("markdown-formatted") === "true") {
        return
      }
      textContainer.innerHTML = markdownToHTML(textContainer.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">"))
      initSourcesPopup()
      textContainer.setAttribute("markdown-formatted", "true")
      htmx.process(textContainer)
    }
  })
  const errorsContainers = document.querySelectorAll("#error-modal #error-content")
  errorsContainers.forEach(container => {
    if (container.getAttribute("markdown-formatted") === "true") {
      return
    }
    try {
      const obj = JSON.parse(container.innerHTML)
      const stringified = JSON.stringify(obj, null, 2)
      container.innerHTML = markdownToHTML("```json\n" + stringified + "\n```")
    } catch (error) {
      container.innerHTML = markdownToHTML(container.innerHTML)
    }
    container.setAttribute("markdown-formatted", "true")
  })
}

export const scrollToBottom = () => {
  const threadContainer = document.getElementById("thread-body")?.parentNode as HTMLElement
  const isNewThreadPage = threadContainer.closest("[data-new-thread-page]")
  if (threadContainer && !isNewThreadPage) {
    threadContainer.scrollTop = threadContainer.scrollHeight
  }
}

export const blockExecution = () => {
  const lastMessageContainer = document.getElementById("last-message")
  if (!lastMessageContainer) {
    return
  }
  const sourcesTitle = lastMessageContainer.querySelector("#thread-sources-title")
  if (sourcesTitle) {
    sourcesTitle.remove()
  }
  const mainSourcesContainer = lastMessageContainer.querySelector("#thread-sources-container[data-current-message]")
  const sourceLoadersContainer = mainSourcesContainer?.querySelector("#thread-sources-loader")
  if (!sourceLoadersContainer?.classList.contains("!hidden")) {
    mainSourcesContainer?.remove()
  }

  const textContainer = lastMessageContainer.querySelector("#thread-text-container[data-current-message]")
  const textLoadersContainer = textContainer?.querySelector("#thread-text-loader")
  textLoadersContainer?.classList.add("!hidden")
  const textContent = textContainer?.querySelector("#thread-text")
  textContent?.classList.remove("!hidden")
  if (textContent) {
    textContent.innerHTML = "Execution stopped"
  }

  const copyButton = lastMessageContainer.querySelector("#copy-response-button")
  if (copyButton) {
    copyButton.setAttribute("disabled", "true")
  }

  const children = lastMessageContainer.querySelectorAll("[data-current-message]")
  children.forEach(child => {
    child.removeAttribute("data-current-message")
  })

  const redoButton = lastMessageContainer.querySelector("#redo-button")
  if (redoButton) {
    redoButton.removeAttribute("disabled")
  }

  const inputPrompt = document.getElementById("input-prompt-inner-container") as HTMLTextAreaElement | null
  inputPrompt?.removeAttribute("data-response-loading")
}

const updateSidebarItem = (container: HTMLElement, threadId: number) => {
  const enpoint = container.getAttribute("data-sidebar-item-endpoint")
  if (!enpoint) {
    return
  }

  htmx.ajax("GET", enpoint, {
    target: `#thread-${threadId}-sidebar`,
    swap: "outerHTML"
  })
}
