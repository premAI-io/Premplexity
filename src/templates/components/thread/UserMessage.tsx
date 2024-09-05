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
    <div { ...editable ? { "data-user-message": "true" } : {}} class={"flex gap-4 justify-end my-4 w-full"}>
      {editable ?
        <>
          <button
            id="edit-message-button"
            class={"flex items-center justify-center"}
            type="button"
            onclick="onEditMessageClick(event)"
          >
            <Icon name={"edit"} />
          </button>
          <div id="edit-message-actions-buttons" class={"flex flex-col md:flex-row gap-3 justify-center items-center"}>
            <button
              id="confirm-edit-message-button"
              class={"flex items-center justify-center"}
              type="button"
              onclick="onConfirmEditMessageClick(event)"
            >
              <Icon name={"check"} />
            </button>
            <button
              id="cancel-edit-message-button"
              class={"flex items-center justify-center"}
              type="button"
              onclick="openConfirmModal(event)"
            >
              <Icon name={"close"} />
            </button>
          </div>
        </>
        : null
      }
      <div class={"bg-gray-600 flex flex-col items-center text-gray-100 py-1.5 px-3 rounded-3xl"}>
        <div data-message-container class={"!bg-transparent text-left text-lg font-medium w-full"}>
          {content.replace(/\n/g, "<br>") as "safe"}
        </div>
        {
          editable ?
          <textarea
            class={"!bg-transparent text-left text-lg font-medium resize-none outline-none w-full hidden"}
            data-message
            readonly
            data-endpoint={getActionPath("thread", "EDIT_MESSAGE", { targetThreadId: threadId })}
          >
            {content as "safe"}
          </textarea>
          :
          null
        }
      </div>
    </div>
  )
}

export default UserMessage
