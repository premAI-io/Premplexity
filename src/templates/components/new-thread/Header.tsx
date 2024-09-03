import Icon from "$templates/components/Icon"
import Logo from "$templates/components/Logo"
import { formId } from "$templates/components/new-thread/NewThreadPage"
import SelectSearchable, { SelectOption } from "$templates/components/SelectSearchable"

type Props = {
  availableModels: SelectOption[]
  availableSources: SelectOption[]
}

const Header = ({
  availableModels,
  availableSources
}: Props) => {
  return (
    <div id="thread-header" class={"thread__header"}>
      <div class={"flex md:hidden justify-between items-center w-full"}>
        <a class={"flex w-fit items-center gap-2 text-white"} href="/" hx-boost="true" hx-target="#page" hx-swap="outerHTML" hx-push-url="true">
          <Logo mobile />
          <div>
            <span class="font-bold">Prem</span>plexity
          </div>
        </a>
      </div>
      <div class={"grid grid-cols-2 gap-x-[10px] mt-6 w-full md:w-fit md:flex md:items-center md:gap-x-4 md:mt-0"}>
        <div class={"w-full md:w-[162px]"}>
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
        <div class={"w-full md:w-[162px]"}>
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
  )
}

export default Header
