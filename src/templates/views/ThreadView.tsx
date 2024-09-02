import { SelectOption } from "$templates/components/Select"
import Sidebar from "$templates/components/Sidebar"
import ThreadPage from "$templates/components/thread/ThreadPage"
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
        <Sidebar threadsList={threadsList} activeThreadId={chat.id} active="chat" />
        <ThreadPage availableModels={availableModels} availableSources={availableSources} thread={chat} />
    </div>
  )
}

export default ThreadView
