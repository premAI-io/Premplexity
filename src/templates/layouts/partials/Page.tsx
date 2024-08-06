import { PropsWithChildren } from "@kitajs/html"

type Props = PropsWithChildren

const Page = ({
  children
}: Props) => {
  return (
    <div
      id="page"
      hx-history-elt
    >
      {children}

      <div id="modal" />
      <div id="toast" />
      <div id="tooltip" />
    </div>
  )
}

export default Page
