import { getActionPath } from "$routers/website/utils"
import Icon from "$templates/components/Icon"
import InputPrompt from "$templates/components/InputPrompt"
import NewThreadBody from "$templates/components/new-thread/NewThreadBody"
import { SelectOption } from "$templates/components/Select"
import SelectSearchable from "$templates/components/SelectSearchable"

type Props = {
  availableModels: SelectOption[]
  availableSources: SelectOption[]
}

export const formId = "thread-form"

const NewThreadPage = ({
  availableModels,
  availableSources
}: Props) => {
  return (
    <form
      id={formId}
      class="w-full h-screen pb-11 flex flex-col"
      action={getActionPath("thread", "CREATE")}
      method="post"
      hx-target={`#sidebar,#${formId}`}
      hx-swap="none"
      hx-push-url="false"
      hx-boost="true"
      {...{
        "hx-on::after-request": "onPromptSubmit()",
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
      </div>
      <NewThreadBody />
      <InputPrompt />
    </form>
  )
}

export default NewThreadPage
