import { SelectOption } from "$templates/components/Select"
import { formId } from "$templates/components/new-thread/NewThreadPage"
import InputPrompt from "$templates/components/InputPrompt"
import ThreadBody from "$templates/components/thread/ThreadBody"
import { ThreadComplete } from "$services/ThreadsService"
import { getActionPath } from "$routers/website/utils"
import Header from "$templates/components/thread/Header"

type Props = {
  availableModels: Record<string, SelectOption[]>
  availableSources: SelectOption[]
  swapOOB?: string
  thread: ThreadComplete
  loading?: boolean
  skeletonMessages?: {
    content: string,
    assistantModel: string,
    webSearchEngineType: string
  },
  githubUrl: string
}

const ThreadPage = ({
  availableModels,
  availableSources,
  swapOOB,
  thread,
  loading,
  skeletonMessages,
  githubUrl
}: Props) => {
  return (
    <form
      id={formId}
      class="w-full h-[calc(100vh-70px)] pb-[70px] md:h-screen md:pb-11 flex flex-col"
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
        "hx-on::before-request": `
          const condition = event.target.closest('.image-card-container') ||
            event.target.closest('#thread-text') ||
            event.target.closest('.source-card__container') ||
            event.target.closest('#thread-header')

            if (condition) {
            return
          }
          onPromptSubmit({ newMessageInserted: event.target.id === this.id })
        `,
      }}
    >
      <Header threadId={thread.id} availableModels={availableModels} availableSources={availableSources} githubUrl={githubUrl} />
      <ThreadBody thread={thread} loading={loading} skeletonMessages={skeletonMessages} />
      <InputPrompt loading={loading} />
    </form>
  )
}

export default ThreadPage
