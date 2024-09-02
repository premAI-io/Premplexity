import { getActionPath } from "$routers/website/utils"
import Icon from "$templates/components/Icon"

type Props = {
  content: string,
  editable?: boolean,
  threadId: number
}

const UserMessage = ({
  content,
  editable = false,
  threadId
}: Props) => {
  return (
    <div class={"flex gap-4 justify-end my-4"}>
      {editable ?
        <button
          id="edit-message-button"
          class={"flex items-center justify-center"}
          type="button"
          onclick="onEditMessageClick(event)"
        >
          <Icon name={"edit"} />
        </button>
        : null
      }
      <div
        class={"bg-gray-600 text-gray-100 text-left text-lg font-medium py-1.5 px-3 rounded-3xl"}
        data-message
        data-endpoint={getActionPath("thread", "EDIT_MESSAGE", { targetThreadId: threadId })}
      >
        {content.replace(/\n/g, "<br>") as "safe"}
      </div>
    </div>
  )
}

export default UserMessage
