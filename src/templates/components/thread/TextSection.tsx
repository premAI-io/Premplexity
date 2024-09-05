import { getActionPath } from "$routers/website/utils"
import { ThreadMessageComplete } from "$services/ThreadMessagesService"
import CopyButton from "$templates/components/CopyButton"
import Icon from "$templates/components/Icon"
import TextLoading from "$templates/components/loaders/TextLoading"
import PremLogo from "$templates/components/PremLogo"
import classNames from "classnames"

type Props = {
  threadId: number,
  loading?: boolean,
  assistantModel: ThreadMessageComplete["assistantModel"],
  assistantError?: ThreadMessageComplete["assistantError"],
  assistantResponse?: ThreadMessageComplete["assistantResponse"],
  isCurrentMessage?: boolean
  lastMessage?: boolean
  messageId: number
}

const TextSection = ({
  threadId,
  loading,
  assistantModel,
  assistantError,
  assistantResponse,
  isCurrentMessage,
  lastMessage = false,
  messageId
}: Props) => {
  return (
    <>
      <div class={"flex-container !gap-x-3 text-sm pt-4"}>
        <PremLogo />
        <div class={"font-semibold"} safe>{assistantModel}</div>
      </div>
      <div id={"thread-text-container"} class={"pt-2"} {...isCurrentMessage ? {
        "data-current-message": messageId
        } : {}
      }>
        <div id="thread-text-loader" class={classNames({
          "!hidden": !loading
        })}>
          <TextLoading />
        </div>
        <div id="thread-text" class={classNames({
          "!hidden": loading,
          "text-red-500": assistantError
        })}>
          {assistantError ?? assistantResponse as "safe"}
        </div>
        <div class={"flex gap-6 items-center justify-end w-full my-4"}>
          {
            lastMessage ?
              <button
                id="redo-button"
                disabled={loading}
                class={"flex items-center justify-center"}
                hx-post={getActionPath("thread", "RETRY", { targetThreadId: threadId })}
                hx-headers='{"HX-Disable-Loader": "true"}'
                hx-include="input[name='model'],input[name='searchEngine']"
                hx-push-url="false"
                hx-swap="innerHTML"
                hx-target="#last-message"
                type="button"
              >
                <Icon
                  name="redo-outline"
                  viewBox="0 0 16 16"
                />
              </button>
              : null
          }
          <div
            id="copy-response-button"
            class={classNames("flex items-center justify-center", {
              "!hidden": !!assistantError
            })}
          >
            <CopyButton disabled={!!assistantError} value={assistantResponse ?? ""} />
          </div>
        </div>
      </div>
    </>
  )
}

export default TextSection
