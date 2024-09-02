import { getActionPath } from "$routers/website/utils"
import { ThreadMessageComplete } from "$services/ThreadMessagesService"

type Props = {
  message: ThreadMessageComplete
}

const Suggestions = ({
  message
}: Props) => {
  return (
    <div id="follow-up-questions" class={"grid gap-[10px] w-full"}>
      <div class={"text-gray-500 text-base text-left"}>Suggestions</div>
      {message.followUpQuestions.filter(suggestion => suggestion.length > 0).map(suggestion => (
        <div
          class="suggestion-item"
          hx-post={getActionPath("thread", "SEND_MESSAGE", { targetThreadId: message.threadId })}
          hx-headers='{"HX-Disable-Loader": "true"}'
          hx-vals={`{"message": "${suggestion}"}`}
          hx-target="#thread-body"
          hx-swap="afterbegin"
          hx-push-url="false"
          {...{
            "hx-on::before-request": "onPromptSubmit({ newMessageInserted: true })",
          }}
          safe
        >
          {suggestion}
        </div>
      ))}
    </div>
  )
}

export default Suggestions
