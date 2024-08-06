import { FormValues } from "$types/ui"
import { getElement, getFormButtons, sortObject } from "../helpers"

export const BUTTON_DEBOUNCE = 200
let form_debounce_timeout: number

const getForm = (formOrId: HTMLFormElement | string): HTMLFormElement => {
  const form = getElement(typeof formOrId === "string" ? `#${formOrId}` : formOrId) as HTMLFormElement
  if (!form) {
    console.error(formOrId)
    throw new Error("Form not found")
  }

  if (!(form instanceof HTMLFormElement)) {
    console.error(formOrId)
    throw new Error("The element is not an `HTMLFormElement`")
  }

  return form
}
const getFormId = (form: HTMLFormElement): string => {
  if (!form.id) {
    console.error(form)
    throw new Error("Form ID not defined")
  }

  return form.id
}
const parseFormValues = (value: string): FormValues => {
  const values = JSON.parse(value)
  if (typeof values !== "object" || Array.isArray(values)) {
    throw new Error("Form values are not an object")
  }
  return values
}
const getFormValuesFromElement = (form: HTMLFormElement) => {
  const valuesElement = form.querySelector("[data-form-values]") as HTMLDivElement
  if (!valuesElement) {
    throw new Error(`getFormInitialValues error: [data-form-values] for form with ID "${form.id}" not found`)
  }

  try {
    return sortObject(parseFormValues(valuesElement.getAttribute("data-form-values") as string))
  } catch (e) {
    console.error(e)
    throw new Error(`getFormInitialValues error: cannot parse values in form with ID "${form.id}"`)
  }
}
const getFormInitialValues = (formOrId: HTMLFormElement | string): FormValues => {
  const form = getForm(formOrId)
  getFormId(form)
  return getFormValuesFromElement(form)
}
const getFormCurrentValues = (formInitialValues: FormValues, form: HTMLFormElement): FormValues => {
  const keys = Object.keys(formInitialValues)
  const values = {} as FormValues
  keys.forEach(key => {
    const inputs = Array.from(form.querySelectorAll(`[name="${key}"]`)) as HTMLInputElement[]

    if (!inputs.length) {
      values[key] = formInitialValues[key]
      return
    }

    if (inputs.length === 1) {
      values[key] = inputs[0].value
      return
    }

    const inputValues = inputs.filter(input => input.checked).map(input => input.value).sort()
    values[key] = inputValues.join(",")
  })
  return sortObject(values)
}
const validateFieldsValues = (initialValues: FormValues, currentValues: FormValues): void => {
  const initialKeys = Object.keys(initialValues).sort()
  const currentKeys = Object.keys(currentValues).sort()
  if (initialKeys.length !== currentKeys.length || JSON.stringify(initialKeys) !== JSON.stringify(currentKeys)) {
    console.error(initialKeys, currentKeys)
    throw new Error("validateFieldsValues error: initialValues and currentValues have different keys")
  }
}
const getFormFieldsDiff = (initialValues: FormValues, currentValues: FormValues): string[] | null => {
  validateFieldsValues(initialValues, currentValues)

  const diff = Object.keys(initialValues).reduce((arr, key) => {
    if (initialValues[key] !== currentValues[key]) {
      arr.push(key)
    }
    return arr
  }, [] as string[])

  return diff.length ? diff : null
}

const hasFormErrors = (form: HTMLFormElement): boolean => {
  const errorMessages = [
    ...Array.from(form.querySelectorAll(".input__caption--error")) as HTMLDivElement[],
    ...Array.from(form.querySelectorAll(".select__caption--error")) as HTMLDivElement[],
    ...Array.from(form.querySelectorAll(".alert--danger")) as HTMLDivElement[]
  ]
  return !!errorMessages.length
}

window.initForms = () => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.removedNodes.forEach(node => {
        if (node instanceof HTMLElement) {
          const forms = Array.from(node.querySelectorAll("[data-form]")) as HTMLFormElement[]
          forms.forEach(form => {
            if (form instanceof HTMLFormElement && node.id) {
              delete window.formValues[form.id]
            }
          })
        }
      })
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

window.registerForm = (formId: string) => {
  if (!window.formValues) {
    window.formValues = {}
  }
  window.formValues[formId] = getFormInitialValues(formId)
  const buttons = getFormButtons(document.getElementById(formId) as HTMLFormElement)
  buttons.filter(button => button.type === "submit").forEach(button => {
    button.setAttribute("disabled", "true")
  })
  const resetButtons = Array.from(document.querySelectorAll(`[data-form-reset="${formId}"]`)) as HTMLButtonElement[]
  resetButtons.forEach(button => {
    button.setAttribute("disabled", "")
  })
}

window.registerFormControl = (formId: string, inputName: string) => {
  const control = document.querySelector(`[data-form-control="${formId}-${inputName}"]`) as HTMLDivElement
  if (!control) {
    throw new Error(`FormControl component with name "${inputName}" in form "${formId}" not found`)
  }

  const inputs = [
    ...Array.from(control.querySelectorAll(`input[name="${inputName}"]`)) as HTMLInputElement[],
    ...Array.from(control.querySelectorAll(`textarea[name="${inputName}"]`)) as HTMLTextAreaElement[],
    ...Array.from(control.querySelectorAll(`select[name="${inputName}"]`)) as HTMLSelectElement[]
  ]

  if (!inputs.length) {
    throw new Error(`Input with name "${inputName}" in form "${formId}" not found`)
  }

  inputs.forEach(input => {
    if (!input.hasFormListener) {
      if (input.type === "checkbox" || input.type === "radio") {
        // checkbox or radio input
        input.addEventListener("change", () => {
          window.onFormUpdate(formId)
        })
      } else {
        if (input instanceof HTMLSelectElement) {
          // normal select input
          input.addEventListener("change", () => {
            window.onFormUpdate(formId)
          })
        } else {
          // normal input
          input.addEventListener("input", () => {
            window.onFormUpdate(formId)
          })
          // Searchable select input
          input.addEventListener("change", () => {
            window.onFormUpdate(formId)
          })
        }
      }

      input.hasFormListener = true
    }
  })
}

window.onFormUpdate = (formOrId: HTMLFormElement | string) => {
  const form = getForm(formOrId)
  const formId = getFormId(form)

  const initialValues = getFormInitialValues(form)
  const currentValues = getFormCurrentValues(initialValues, form)
  const changedFields = getFormFieldsDiff(initialValues, currentValues)

  const controls = Array.from(form.querySelectorAll("[data-form-control]")) as HTMLDivElement[]
  controls.forEach(control => {
    const attr = control.getAttribute("data-form-control") as string
    const name = attr.substring(attr.lastIndexOf("-") + 1)
    const showChanged = control.getAttribute("data-form-control-show-changed") === "true"
    if (!showChanged) {
      return
    }
    control.classList.toggle("input-changed", !!changedFields && changedFields.includes(name))
  })

  const resetButtons = Array.from(document.querySelectorAll(`[data-form-reset="${formId}"]`)) as HTMLButtonElement[]
  const submitButton = getFormButtons(form).find(button => button.type === "submit")

  if (resetButtons.length) {
    resetButtons.forEach(button => {
      if (changedFields) {
        button.removeAttribute("disabled")
      } else {
        button.setAttribute("disabled", "")
      }
    })
  }

  if (changedFields) {
    form.setAttribute("data-form-changed", "true")
    submitButton?.removeAttribute("disabled")
  } else {
    form.removeAttribute("data-form-changed")
    let canDisableSubmit = true

    if (canDisableSubmit) {
      submitButton?.setAttribute("disabled", "")
    }
  }
}

window.resetForm = (formOrId: HTMLFormElement | string) => {
  const form = getForm(formOrId)
  const formId = getFormId(form)
  const initialValues = getFormInitialValues(form)

  Object.entries(initialValues).forEach(([key, value]) => {
    const control = form.querySelector(`[data-form-control="${formId}-${key}"]`) as HTMLDivElement
    if (!control) {
      return
    }

    const inputs = [
      ...Array.from(control.querySelectorAll(`input[name="${key}"]`)) as HTMLInputElement[],
      ...Array.from(control.querySelectorAll(`textarea[name="${key}"]`)) as HTMLTextAreaElement[],
      ...Array.from(control.querySelectorAll(`select[name="${key}"]`)) as HTMLSelectElement[]
    ]
    inputs.forEach(input => {
      if (input instanceof HTMLInputElement && (input.type === "checkbox" || input.type === "radio")) {
        input.checked = `${value}`.split(",").includes(input.value)
      } else {
        input.value = `${value}`
      }
      if (input instanceof HTMLInputElement) {
        window.clearInputError(input)
      }
    })
  })

  window.onFormUpdate(form)
}

window.clearInputError = (elementOrSelector: HTMLInputElement | string) => {
  const input = getElement(elementOrSelector)
  // input
  input?.closest(".input__wrap")?.classList.remove("input__wrap--error")
  const errorMessages = Array.from(input?.closest(".input__wrap")?.querySelectorAll(".input__caption--error") ?? []) as HTMLDivElement[]
  errorMessages.forEach(message => {
    message.remove()
  })
  // select
  input?.closest(".select__wrap")?.classList.remove("select__wrap--error")
  const errorMessagesSelect = Array.from(input?.closest(".select__wrap")?.querySelectorAll(".select__caption--error") ?? []) as HTMLDivElement[]
  errorMessagesSelect.forEach(message => {
    message.remove()
  })
}

window.onFormBeforeRequest = (elementOrSelector: HTMLFormElement | string) => {
  const form = getElement(elementOrSelector) as HTMLFormElement
  if (form) {
    const buttons = getFormButtons(form)
    buttons.forEach(button => {
      if (button.type === "submit") {
        clearTimeout(form_debounce_timeout)
        form_debounce_timeout = window.setTimeout(() => {
          button.classList.add("btn--loading")
        }, BUTTON_DEBOUNCE)
      }
      button.setAttribute("disabled", "")
    })
  }
}

window.onFormAfterRequest = (elementOrSelector: HTMLFormElement | string) => {
  const form = getElement(elementOrSelector) as HTMLFormElement
  if (form) {
    const buttons = getFormButtons(form)
    buttons.forEach(button => {
      if (button.type === "submit") {
        clearTimeout(form_debounce_timeout)
        button.classList.remove("btn--loading")
      }
    })

    if (hasFormErrors(form)) {
      const resetButtons = Array.from(document.querySelectorAll(`[data-form-reset="${form.id}"]`)) as HTMLButtonElement[]
      resetButtons.forEach(button => {
        button.removeAttribute("disabled")
      })
    }
  }
}
