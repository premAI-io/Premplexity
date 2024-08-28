import { ThreadMessageComplete } from "$services/ThreadMessagesService"
import CopyButton from "$templates/components/CopyButton"
import TextLoading from "$templates/components/loaders/TextLoading"
import PremLogo from "$templates/components/PremLogo"
import { parseAssistantResponse } from "$utils/thread"
import classNames from "classnames"

type Props = {
  loading?: boolean,
  assistantModel: ThreadMessageComplete["assistantModel"],
  assistantError?: ThreadMessageComplete["assistantError"],
  assistantResponse?: ThreadMessageComplete["assistantResponse"],
  isCurrentMessage?: boolean
}

const TextSection = ({
  loading,
  assistantModel,
  assistantError,
  assistantResponse,
  isCurrentMessage
}: Props) => {
  return (
    <>
      <div class={"flex-container !gap-x-3 text-sm pt-4"}>
        <PremLogo />
        <div class={"font-semibold"} safe>{assistantModel}</div>
      </div>
      <div id="thread-text-container" class={"pt-2"} {...isCurrentMessage ? {
        "data-current-message": ""
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
        <div
          id="copy-response-button"
          class={"ml-auto w-fit my-4"}
        >
          <CopyButton disabled={!assistantResponse || loading} value={parseAssistantResponse(assistantResponse ?? "")} />
        </div>
      </div>
    </>
  )
}

export default TextSection
