import History from "$templates/components/mobile/History"
import { SelectOption } from "$templates/components/SelectSearchable"
import Sidebar from "$templates/components/Sidebar"
import Header from "$templates/components/thread/Header"
import { ThreadListItem } from "$templates/views/NewThreadView"

type Props = {
  lastViewedThreadId?: number
  threadsList: ThreadListItem[]
  availableModels: Record<string, SelectOption[]>
  availableSources: SelectOption[]
  githubUrl: string
}

const HistoryView = ({
  threadsList,
  lastViewedThreadId,
  availableModels,
  availableSources,
  githubUrl
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
        githubUrl={githubUrl}
      />
      <History threadsList={threadsList} />
    </div>
  )
}

export default HistoryView
