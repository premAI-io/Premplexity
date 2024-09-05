import Button from "$templates/components/Button"
import Modal from "$templates/components/Modal"
import { PropsWithChildren } from "@kitajs/html"

type Props = PropsWithChildren & {
  isMobile: boolean
}

const Page = ({
  children,
  isMobile
}: Props) => {
  return (
    <div
      id="page"
      hx-history-elt
      {...(isMobile ? { "data-is-mobile": "true" } : {})}
    >
      {children}

      <div id="modal" />
      <div id="confirm-modal-container">
        <Modal
          title="Warning"
          id="confirm-modal"
          ariaLabelledby="confirm-modal"
          removeOnClose={false}
          footer={
            <div class="w-full grid grid-cols-2 md:flex md:justify-end gap-4 mt-4">
              <Button
                type="button"
                outline
                theme="secondary"
                class="button button--secondary"
                onclick="closeModal('confirm-modal', false);document.querySelector('textarea[data-original]')?.focus();"
              >
                Cancel
              </Button>
              <Button
                theme="secondary"
                class="button"
                type="button"
                onclick="onCancelEditMessageClick(event);closeModal('confirm-modal', false)"
              >
                Confirm
              </Button>
            </div>
          }
        >
          <div>
            Are you sure you want to close message editing? Your changes will not be saved.
          </div>
        </Modal>
      </div>
      <div id="toast" />
      <div id="tooltip" />
    </div>
  )
}

export default Page
