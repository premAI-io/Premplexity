import Modal from "$templates/components/Modal"

type Props = {
  error: string
}

const ErrorModal = ({
  error
}: Props) => {
  return (
    <Modal
      id={"error-modal"}
      ariaLabelledby="error-modal"
      title={"Error"}
      isOpen
      closable
    >
      <div id="error-content" class={"h-full overflow-y-auto"}>
        {error}
      </div>
    </Modal>
  )
}

export default ErrorModal
