import { AlertTheme } from "$templates/components/Alert"

export type FormMessage = {
  title: string
  description?: JSX.Element
  icon?: JSX.Element
  theme?: AlertTheme
  closable?: boolean
}

export type FormValues = {
  [key: string]: number | string
}
export type FormValuesChanged<FormData extends FormValues> = {
  [key in keyof FormData]: boolean
}

export type FormErrors<FormData> = Partial<Record<keyof FormData, JSX.Element>>

export type FormCommonProps<FormData, InitialValuesRequired extends boolean = false> = {
  errors?: FormErrors<FormData>
  message?: FormMessage
} & (InitialValuesRequired extends true ? {
  initialValues: FormData
  values: FormData
} : {
  initialValues?: Partial<FormData>
  values?: Partial<FormData>
})

export type WithClass<T extends JSX.HtmlTag = JSX.HtmlTag> = Omit<T, "class" | "className"> & {
  class?: string
}
