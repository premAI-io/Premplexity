import ErrorPage from "$templates/components/ErrorPage"

type NotFoundPageProps = {
  loggedIn?: boolean
}

const NotFoundPage = ({
  loggedIn = false,
}: NotFoundPageProps) => {
  return (
    <ErrorPage
      code={404}
      title={"Page not found"}
      message={"The page you are looking for does not exist."}
      loggedIn={loggedIn}
      showButton={!loggedIn}
    />
  )
}

export default NotFoundPage
