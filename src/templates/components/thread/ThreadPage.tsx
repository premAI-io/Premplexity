import Icon from "$templates/components/Icon"
import { SelectOption } from "$templates/components/Select"
import SelectSearchable from "$templates/components/SelectSearchable"
import { formId } from "$templates/components/new-thread/NewThreadPage"
import NewThreadButton from "$templates/components/new-thread/NewThreadButton"
import InputPrompt from "$templates/components/InputPrompt"
import ThreadBody from "$templates/components/thread/ThreadBody"
import { ThreadComplete } from "$services/ThreadsService"
import { getActionPath } from "$routers/website/utils"

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
      class="w-full h-screen pb-11 flex flex-col"
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
        "hx-on::before-request": "onPromptSubmit({ newMessageInserted: event.detail.target.id === this.id })",
      }}
    >
      <div id="thread-header" class={"thread__header"}>
        <div class={"flex-container"}>
          <div class={"w-[162px]"}>
            <SelectSearchable
              id="thread-model"
              prepend={
                <Icon name="brain" viewBox="0 0 16 16" />
              }
              options={availableModels}
              name="model"
              inputValue={`${availableModels.find(({ selected }) => selected)?.label}`}
              value={`${availableModels.find(({ selected }) => selected)?.value}`}
              dropdownOpen={false}
              form={formId}
            />
          </div>
          <div class={"w-[162px]"}>
            <SelectSearchable
              id="thread-searchEngine"
              prepend={
                <Icon name="globe" viewBox="0 0 16 16" />
              }
              options={availableSources}
              name="searchEngine"
              inputValue={`${availableSources.find(({ selected }) => selected)?.label}`}
              value={`${availableSources.find(({ selected }) => selected)?.value}`}
              dropdownOpen={false}
              form={formId}
            />
          </div>
        </div>
        <NewThreadButton />
      </div>
      <ThreadBody thread={thread} loading={loading} skeletonMessages={skeletonMessages} />
      <InputPrompt />
    </form>
  )
}

export default ThreadPage
