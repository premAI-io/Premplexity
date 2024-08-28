import { getActionPath } from "$routers/website/utils"
import Button from "$templates/components/Button"
import Modal from "$templates/components/Modal"

type Props = {
  threadId: number
}

const DeleteThreadModal = ({
  threadId
}: Props) => {
  return (
    <Modal
      ariaLabelledby="delete-thread-modal"
      title={"Delete thread"}
      isOpen={true}
      size="sm"
      closable={true}
      {...{
        ["hx-on::load"]: "htmx.process(event.detail.elt)"
      }}
      footer={<div class="flex justify-end gap-4 mt-4">
        <form
          method="post"
          action={getActionPath("thread", "DELETE", { targetThreadId: threadId })}
          {...{
            ["hx-on::after-request"]: "closeModal('user-block-modal')"
          }}
        >
          <Button type="button" theme="secondary" onclick="closeModal(event)">
            Cancel
          </Button>
          <Button type="submit" theme="danger">
            Delete
          </Button>
        </form>
      </div>}
    >
      <div>
        Are you sure you want to delete this thread?
      </div>
    </Modal>
  )
}

export default DeleteThreadModal
