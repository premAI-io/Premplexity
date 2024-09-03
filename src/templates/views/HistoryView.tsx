import History from "$templates/components/mobile/History"
import { SelectOption } from "$templates/components/SelectSearchable"
import Sidebar from "$templates/components/Sidebar"
import Header from "$templates/components/thread/Header"
import { ThreadListItem } from "$templates/views/NewThreadView"

type Props = {
  lastViewedThreadId?: number
  threadsList: ThreadListItem[]
  availableModels: SelectOption[]
  availableSources: SelectOption[]
}

const HistoryView = ({
  threadsList,
  lastViewedThreadId,
  availableModels,
  availableSources
}: Props) => {
  return (
    <div id="thread-container" class={"w-full h-full !overflow-hidden"}>
      <Sidebar
        threadsList={threadsList}
        active="history"
        lastViewedThreadId={lastViewedThreadId}
      />
      <Header
        availableModels={availableModels}
        availableSources={availableSources}
      />
      <History threadsList={threadsList} />
    </div>
  )
}

export default HistoryView
