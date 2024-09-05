import { SelectOption } from "$templates/components/Select"
import { formId } from "$templates/components/new-thread/NewThreadPage"
import InputPrompt from "$templates/components/InputPrompt"
import ThreadBody from "$templates/components/thread/ThreadBody"
import { ThreadComplete } from "$services/ThreadsService"
import { getActionPath } from "$routers/website/utils"
import Header from "$templates/components/thread/Header"

type Props = {
  availableModels: SelectOption[]
  availableSources: SelectOption[]
  swapOOB?: string
  thread: ThreadComplete
  loading?: boolean
  skeletonMessages?: {
    content: string,
    assistantModel: string,
    webSearchEngineType: string
  }
}

const ThreadPage = ({
  availableModels,
  availableSources,
  swapOOB,
  thread,
  loading,
  skeletonMessages
}: Props) => {
  return (
    <form
      id={formId}
      class="w-full h-[calc(100vh-60px)] pb-[60px] md:h-screen md:pb-11 flex flex-col"
      action={getActionPath("thread", "SEND_MESSAGE", {
        targetThreadId: thread.id
      })}
      method="POST"
      hx-boost="true"
      hx-target="#thread-body"
      hx-swap="afterbegin"
      hx-push-url="false"
      {...swapOOB ? { "hx-swap-oob": swapOOB } : {}}
      {...{
        "hx-on::before-request": "if (event.target.closest('.image-card-container') || event.target.closest('#thread-text')) { return; }; onPromptSubmit({ newMessageInserted: event.target.id === this.id })",
      }}
    >
      <Header threadId={thread.id} availableModels={availableModels} availableSources={availableSources} />
      <ThreadBody thread={thread} loading={loading} skeletonMessages={skeletonMessages} />
      <InputPrompt loading={loading} />
    </form>
  )
}

export default ThreadPage
