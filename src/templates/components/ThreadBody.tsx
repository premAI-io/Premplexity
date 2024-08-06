import Button from "$templates/components/Button"
import Icon from "$templates/components/Icon"
import { SelectOption } from "$templates/components/Select"
import SelectSearchable from "$templates/components/SelectSearchable"

type Props = {
  availableModels: SelectOption[]
  availableSources: SelectOption[]
}

const formId = "thread-form"

const ThreadBody = ({
  availableModels,
  availableSources
}: Props) => {
  return (
    <form id={formId} class="w-full">
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
        <div>
          <a href="/" hx-boost="true" hx-push-url="true">
            <Button theme="secondary" type="button">
              <Icon name="plus" />
              New
            </Button>
          </a>
        </div>
      </div>
    </form>
  )
}

export default ThreadBody
