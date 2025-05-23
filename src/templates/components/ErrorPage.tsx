import Button from "$templates/components/Button"
import classNames from "classnames"

type ErrorPageProps = {
  children?: JSX.Element
  showButton?: boolean
  loggedIn?: boolean
  code: number
  title: string
  message?: string
}

const ErrorPage = ({
  children,
  showButton = true,
  loggedIn = false,
  code,
  title,
  message,
}: ErrorPageProps) => {
  return (
    <div class={classNames("error-page__container", {
      "h-full flex justify-center items-center": !loggedIn,
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
        {showButton ?
          <a href={"/"} hx-boost="true" class={"mt-8"}>
            <Button outline>Homepage</Button>
          </a>
          : null
        }
      </div>
    </div>
  )
}

export default ErrorPage
