import Sprites from "$templates/components/Sprites"
import { PropsWithChildren } from "@kitajs/html"

type Props = PropsWithChildren

const Body = ({
  children
}: Props) => {
  return (
    <body
      hx-ext="response-targets"
      hx-target="#page"
      hx-swap="outerHTML"
    >
      <div id="loader"></div>

      {children}

      <Sprites />
    </body>
  )
}

export default Body
