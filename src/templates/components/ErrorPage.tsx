import classNames from "classnames"

type ErrorPageProps = {
  children?: JSX.Element
  loggedIn?: boolean
  code: number
  title: string
  message?: string
}

const ErrorPage = ({
  children,
  loggedIn = false,
  code,
  title,
  message,
}: ErrorPageProps) => {
  return (
    <div class={classNames("error-page__container", {
      "h-screen flex justify-center items-center": !loggedIn,
    })}>
      <div class={classNames("error-page__card", loggedIn ? "w-full" : "max-w-[652px] !h-fit")}>
        <div class={"error-page__code"}>{code}</div>
        <div class={"error-page__title"} safe>{title}</div>
        {children ?
          children :
            message ?
            <div class={"error-page__message mt-4"} safe>
              {message}
            </div>
            : null
        }
      </div>
    </div>
  )
}

export default ErrorPage
