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
      id="delete-thread-modal"
      ariaLabelledby="delete-thread-modal"
      title={"Delete thread"}
      isOpen={true}
      size="sm"
      closable={true}
      {...{
        ["hx-on::load"]: "htmx.process(event.detail.elt)"
      }}
      footer={
        <div class="w-full grid grid-cols-2 md:flex md:justify-end gap-4 mt-4">
          <Button type="button" theme="secondary" onclick="closeModal(event)">
            Cancel
          </Button>
          <form
            class={"md:w-fit w-full"}
            method="post"
            action={getActionPath("thread", "DELETE", { targetThreadId: threadId })}
            hx-boost="true"
            hx-push-url="false"
            {...{
              ["hx-on::after-request"]: "closeModal('delete-thread-modal')"
            }}
          >
            <Button class="w-full md:w-auto" type="submit" theme="danger">
              Delete
            </Button>
          </form>
        </div>
      }
    >
      <div>
        Are you sure you want to delete this thread?
      </div>
    </Modal>
  )
}

export default DeleteThreadModal
