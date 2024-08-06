import { FormValues, FormValuesChanged } from "$types/ui"

export function validateFieldsValues(initialValues: FormValues, currentValues: FormValues): void {
  const initialKeys = Object.keys(initialValues).sort()
  const currentKeys = Object.keys(currentValues).sort()
  if (initialKeys.length !== currentKeys.length || JSON.stringify(initialKeys) !== JSON.stringify(currentKeys)) {
    console.error(initialKeys, currentKeys)
    throw new Error("validateFieldsValues error: initialValues and currentValues have different keys")
  }
}
export function getFormChangedFields<FormData extends FormValues>(initialValues: FormData, currentValues: FormData): FormValuesChanged<FormData> {
  validateFieldsValues(initialValues, currentValues)

  return Object.keys(initialValues).reduce((obj, key) => {
    obj[key as keyof FormValuesChanged<FormData>] = initialValues[key] !== currentValues[key]
    return obj
  }, {} as FormValuesChanged<FormData>)
}

export function setFormInitialData(formData: Partial<FormValues>): string {
  const values = {} as FormValues
  Object.entries(formData)
    .sort(([key1], [key2]) => key1 > key2 ? 1 : -1)
    .forEach(([key, value]) => {
      values[key] = Array.isArray(value) ? value.sort().join(",") : (value ?? "")
    })
  return JSON.stringify(values)
}
