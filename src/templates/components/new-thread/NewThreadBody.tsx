import { getActionPath } from "$routers/website/utils"
import Icon from "$templates/components/Icon"
import { NEW_THREAD_SUGGESTIONS } from "$types/SUGGESTIONS"

const NewThreadBody = () => {
  return (
    <div id="thread-body" class={"flex-1 pt-20 text-center max-w-[678px] w-[70%] mx-auto"}>
      <Icon name="initial-chat-icon" size={54} viewBox="0 0 54 43" />
      <div class={"mt-8 text-white font-medium text-xl text-left"}>Ask a question or start by our suggestion on trending topics!</div>
      <div class={"mt-11 grid gap-[10px] w-full"}>
        <div class={"text-gray-500 text-base text-left"}>Suggestions</div>
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
  )
}

export default NewThreadBody
