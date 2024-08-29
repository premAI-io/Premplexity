import markdownit from "markdown-it"
import hljs from "highlight.js"
import initSourcesPopup from "src/client/scripts/modules/source-popup"

const md = markdownit()

export const markdownToHTML = (markdown: string): string => {
  md.set({
    html: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value
        } catch (__) {
          return ""
        }
      }
      return ""
    }
  })

  const rendered = md.render(markdown)
  initSourcesPopup()
  return rendered
}

export const addPreCopyButtons = () => {
  const preElements = document.querySelectorAll("pre")
  preElements.forEach(preElement => {
    if (preElement.querySelector("button[data-value]")) {
      return
    }

    const copyButton = document.createElement("button")
    copyButton.setAttribute("type", "button")
    copyButton.setAttribute("data-value", preElement.innerText)
    copyButton.addEventListener("click", event => {
      window.copyToClipboard(event, () => {
        window.toggleCopyIcon(event.target as HTMLElement)
      })
    })

    const icon = document.createElement("div")
    icon.classList.add("icon")
    icon.style.cssText = "--icon-size:16;"

    icon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 20 20" role="img">
        <use href="#file-copy"></use>
      </svg>
    `
    copyButton.appendChild(icon)
    preElement.appendChild(copyButton)
  })
}

