export function getElement(elementOrSelector: HTMLElement | string): HTMLElement | null {
  if (typeof elementOrSelector === "string") {
    return document.querySelector(elementOrSelector)
  }

  return elementOrSelector as HTMLElement
}

export function getFormButtons(form: HTMLFormElement) {
  const formButtons = Array.from(form.querySelectorAll("button"))
  const formId = form.id
  if (formId) {
    formButtons.push(...Array.from(
      document.querySelectorAll(`button[form=${formId}]`) as NodeListOf<HTMLButtonElement>
    ))
  }
  return formButtons
}

type Obj = {
  [key: string]: boolean | number | string
}
export function sortObject<O extends Obj = Obj>(obj: O): O {
  return Object.entries(obj)
    .sort(([key1], [key2]) => key1 > key2 ? 1 : -1)
    .reduce((o, [key, value]) => {
      (o as Obj)[key] = value
      return o
    }, {} as O)
}
