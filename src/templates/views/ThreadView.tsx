import { Thread } from "$db_schemas/threads"
import { SelectOption } from "$templates/components/Select"
import Sidebar from "$templates/components/Sidebar"
import ThreadBody from "$templates/components/ThreadBody"
import MobileNavbar from "$templates/components/mobile/Navbar"
import { ThreadListItem } from "$templates/views/NewThreadView"

type Props = {
  threadsList: ThreadListItem[]
  chat: Thread
  availableModels: SelectOption[]
  availableSources: SelectOption[]
}

const ThreadView = ({
  threadsList,
  chat,
  availableModels,
  availableSources
}: Props) => {
  return (
    <div id="thread-container" class={"w-full h-full"}>
      <div class="desktop-container">
        <Sidebar threadsList={threadsList} activeThreadId={chat.id} />
        <ThreadBody availableModels={availableModels} availableSources={availableSources} />
      </div>
      <div class="mobile-container">
        <MobileNavbar />
      </div>
    </div>
  )
}

export default ThreadView
