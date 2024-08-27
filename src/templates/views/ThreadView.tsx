import { SelectOption } from "$templates/components/Select"
import Sidebar from "$templates/components/Sidebar"
import ThreadPage from "$templates/components/thread/ThreadPage"
import MobileNavbar from "$templates/components/mobile/Navbar"
import { ThreadListItem } from "$templates/views/NewThreadView"
import { ThreadComplete } from "$services/ThreadsService"

type Props = {
  threadsList: ThreadListItem[]
  chat: ThreadComplete
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
        <ThreadPage availableModels={availableModels} availableSources={availableSources} thread={chat} />
      </div>
      <div class="mobile-container">
        <MobileNavbar />
      </div>
    </div>
  )
}

export default ThreadView
