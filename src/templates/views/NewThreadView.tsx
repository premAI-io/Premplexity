import { Thread } from "$db_schemas/threads"
import NewThreadBody from "$templates/components/NewThreadBody"
import { SelectOption } from "$templates/components/Select"
import Sidebar from "$templates/components/Sidebar"
import MobileNavbar from "$templates/components/mobile/Navbar"

export type ThreadListItem = {
  time: string
  threads: Thread[]
}

type Props = {
  threadsList: ThreadListItem[]
  availableModels: SelectOption[]
  availableSources: SelectOption[]
}

const NewThreadView = ({
  threadsList,
  availableModels,
  availableSources
}: Props) => {
  return (
    <div id="thread-container" class={"w-full h-full"}>
      <div class="desktop-container">
        <Sidebar threadsList={threadsList} />
        <NewThreadBody availableModels={availableModels} availableSources={availableSources} />
      </div>
      <div class="mobile-container">
        <MobileNavbar />
      </div>
    </div>
  )
}

export default NewThreadView
