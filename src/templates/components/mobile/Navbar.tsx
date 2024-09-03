import Icon from "$templates/components/Icon"
import classNames from "classnames"

type Props = {
  lastViewedThreadId?: number
  active: "chat" | "history"
}

const Navbar = ({
  lastViewedThreadId,
  active
}: Props) => {
  return (
    <div class={"mobile-navbar"}>
      <a
        data-thread-button
        href={lastViewedThreadId ? `/thread/${lastViewedThreadId}` : "/"}
        hx-boost="true"
        class={classNames("mobile-navbar__item", { "active": active === "chat" })}
        {...{
          "hx-on::before-request": "localStorage.removeItem('lastViewedThreadId')"
        }}
      >
        <Icon name="chat-messages" viewBox={"0 0 17 17"} />
        <div>Chat</div>
      </a>
      <a href="/history" hx-boost="true" class={classNames("mobile-navbar__item", { "active": active === "history" })}>
        <Icon name="history" viewBox={"0 0 16 14"} />
        <div>History</div>
      </a>
      <script>{`
        void (() => {
          const lastViewedThreadId = ${lastViewedThreadId}
          if (lastViewedThreadId) {
            localStorage.setItem("lastViewedThreadId", lastViewedThreadId)
          }

          const button = document.querySelector("[data-thread-button]")
          if (button) {
            const fromStorage = localStorage.getItem("lastViewedThreadId")
            button.href = fromStorage ? \`/thread/\${fromStorage}\` : "/"
            htmx.process(button)
          }
        })()
      `}</script>
    </div>
  )
}

export default Navbar
