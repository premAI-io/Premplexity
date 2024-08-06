import { getActionPath } from "$routers/website/utils"
import Icon from "$templates/components/Icon"
import InputPrompt from "$templates/components/InputPrompt"
import { SelectOption } from "$templates/components/Select"
import SelectSearchable from "$templates/components/SelectSearchable"
import { NEW_THREAD_SUGGESTIONS } from "$types/SUGGESTIONS"

type Props = {
  availableModels: SelectOption[]
  availableSources: SelectOption[]
}

const formId = "new-thread-form"

const NewThreadBody = ({
  availableModels,
  availableSources
}: Props) => {
  return (
    <form id={formId} class="w-full h-screen pb-11 flex flex-col">
      <div class={"thread__header"}>
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
            id="thread-source"
            prepend={
              <Icon name="globe" viewBox="0 0 16 16" />
            }
            options={availableSources}
            name="source"
            inputValue={`${availableSources.find(({ selected }) => selected)?.label}`}
            value={`${availableSources.find(({ selected }) => selected)?.value}`}
            dropdownOpen={false}
            form={formId}
          />
          </div>
        </div>
      </div>
      <div class={"flex-1 pt-20 text-center max-w-[678px] w-[70%] mx-auto"}>
        <Icon name="initial-chat-icon" size={54} viewBox="0 0 54 43" />
        <div class={"mt-8 text-white font-medium text-xl text-left"}>Ask a question or start by our suggestion on trending topics!</div>
        <div class={"mt-11 grid gap-[10px] w-full"}>
          <div class={"text-grey-500 text-base text-left"}>Suggestions</div>
          {NEW_THREAD_SUGGESTIONS.map(suggestion => (
            <div
              class="suggestion-item"
              hx-post={getActionPath("thread", "CREATE")}
              hx-vals={`{"message": "${suggestion}"}`}
              hx-target="#thread-container"
              hx-swap="outerHTML"
              safe
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>
      <InputPrompt />
    </form>
  )
}

export default NewThreadBody
