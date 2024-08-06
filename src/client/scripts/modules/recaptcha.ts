import htmx from "htmx.org"

type Recaptcha = object & {
  ready: (callback: () => void) => void
  execute: (siteKey: string, options: { action: string }) => Promise<string>
  render: (element: string | HTMLElement, options: { sitekey: string, callback: (token: string) => void }) => void
  reset: () => void
}

const getFormData = (form: HTMLFormElement): { [key: string]: string } => {
  const data = new FormData(form)
  const payload: { [key: string]: string } = {}
  data.forEach((value, key) => {
    payload[key] = value.toString()
  })

  return payload
}

const ALLOWED_METHODS = ["POST", "GET"]

const executeV3 = async (event: CustomEvent, grecaptcha: Recaptcha, recaptchaKey: string) => {
  const form = event.target as HTMLFormElement
  event.preventDefault()
  grecaptcha.ready(() => {
    grecaptcha.execute(recaptchaKey, { action: "submit" })
      .then((token: string) => {
        const method = form.getAttribute("method")?.toUpperCase()
        if (!method || !ALLOWED_METHODS.includes(method)) {
          return
        }

        // submit the form
        htmx.ajax(method, form.action, {
          values: {
            ...getFormData(form),
            recaptcha: token
          },
          swap: "outerHTML"
        })
      })
  })
}

const recaptchaV2onLoad = (grecaptcha: Recaptcha, recaptchaKey: string) => {
  const container = document.getElementById("recaptcha-v2-container")
  if (!container) {
    return
  }

  setTimeout(() => {
    for (const child of Array.from(container.children)) {
      container.removeChild(child)
    }
    grecaptcha.render("recaptcha-v2-container", {
      sitekey: recaptchaKey,
      callback: function(token: string) {
        const container = document.getElementById("recaptcha-v2-container")
        if (!container) {
          return
        }

        const method = container.getAttribute("data-method")
        const action = container.getAttribute("data-action")
        const dataValues = container.getAttribute("data-values") ?? "{}"

        if (!method || !action) {
          return
        }

        container.removeAttribute("data-method")
        container.removeAttribute("data-action")
        container.removeAttribute("data-values")

        const values = JSON.parse(dataValues)
        values["recaptcha"] = token

        htmx.ajax(method, action, {
          swap: "outerHTML",
          values
        })
      }
    })
  }, 1000)
}

export type Module = {
  executeV3: (event: CustomEvent, grecaptcha: Recaptcha, recaptchaKey: string) => Promise<void>,
  recaptchaV2onLoad: (grecaptcha: Recaptcha, recaptchaKey: string) => void
}

const recaptcha: Module = {
  executeV3,
  recaptchaV2onLoad
}

export default recaptcha
