import { getActionPath } from "$routers/website/utils"
import Icon from "$templates/components/Icon"
import { NEW_THREAD_SUGGESTIONS } from "$types/SUGGESTIONS"

const NewThreadBody = () => {
  return (
    <div class={"overflow-y-auto scrollbar md:flex-1 mt-0 pb-[60px] md:pb-0 md:mb-5"}>
      <div id="thread-body" class={"new-thread-body"}>
        <Icon class={"md:!inline-flex !hidden"} name="initial-chat-icon" size={54} viewBox="0 0 54 43" />
        <div class={"md:mt-8 text-white font-medium text-base md:text-xl text-left"}>Ask a question or start by our suggestion on trending topics!</div>
        <div class={"mt-5 md:mt-11 grid gap-[10px] w-full"}>
          <div class={"text-gray-500 text-xs md:text-base text-left"}>Suggestions</div>
          {NEW_THREAD_SUGGESTIONS.map(suggestion => (
            <div
              class="suggestion-item"
              hx-post={getActionPath("thread", "CREATE")}
              hx-vals={`{"message": "${suggestion}"}`}
              hx-target="#thread-container"
              hx-swap="outerHTML"
              safe
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NewThreadBody
