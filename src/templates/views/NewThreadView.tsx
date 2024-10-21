import NewThreadPage from "$templates/components/new-thread/NewThreadPage"
import { SelectOption } from "$templates/components/Select"
import Sidebar from "$templates/components/Sidebar"
import { ThreadComplete } from "$services/ThreadsService"

export type ThreadListItem = {
  time: string
  threads: ThreadComplete[]
}

type Props = {
  threadsList: ThreadListItem[]
  availableModels: Record<string, SelectOption[]>
  availableSources: SelectOption[]
  githubUrl: string
}

const NewThreadView = ({
  threadsList,
  availableModels,
  availableSources,
  githubUrl
}: Props) => {
  return (
    <div id="thread-container" class={"w-full h-full"}>
      <Sidebar threadsList={threadsList} active="chat" />
      <NewThreadPage availableModels={availableModels} availableSources={availableSources} githubUrl={githubUrl} />
    </div>
  )
}

export default NewThreadView
