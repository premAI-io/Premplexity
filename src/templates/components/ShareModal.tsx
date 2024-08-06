import { getActionPath } from "$routers/website/utils"
import { ThreadShareLinkComplete } from "$services/ThreadShareLinksService"
import Button from "$templates/components/Button"
import Icon from "$templates/components/Icon"
import Input from "$templates/components/Input"
import Modal from "$templates/components/Modal"

type Props = {
  snapshot: ThreadShareLinkComplete
  baseUrl: string
}

const ShareModal = ({
  snapshot,
  baseUrl
}: Props) => {
  const link = `${baseUrl}${getActionPath("snapshot", "IMPORT", { targetSnapshotCode: snapshot.code })}`
  return (
    <Modal
      id="share-thread-modal"
      ariaLabelledby="share-thread-modal"
      title={"Share thread"}
      isOpen={true}
      size="sm"
      closable={true}
      footer={<div class={"w-full"}>
        <Button
          class={"w-full flex items-center justify-center"}
          data-value={link}
          onclick={`
            copyToClipboard(event, () => {
              toggleCopyIcon(event.target)
            })
          `}
        >
          <p>Copy link</p>
          <Icon name={"file-copy"} size={16} />
        </Button>
      </div>}
      {...{
        ["hx-on::load"]: "htmx.process(event.detail.elt)"
      }}
    >
      <Input
        value={link}
        readonly
      />
    </Modal>
  )
}

export default ShareModal
