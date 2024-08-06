import GithubButton from "$templates/components/GithubButton"
import Icon from "$templates/components/Icon"
import Logo from "$templates/components/Logo"
import ModelsDropdown from "$templates/components/ModelsDropdown"
import { formId } from "$templates/components/new-thread/NewThreadPage"
import SelectSearchable, { SelectOption } from "$templates/components/SelectSearchable"

type Props = {
  availableModels: Record<string, SelectOption[]>
  availableSources: SelectOption[]
  githubUrl: string
}

const getModelsDropdownInputValue = (availableModels: Record<string, SelectOption[]>) => {
  for (const provider in availableModels) {
    const selectedModel = availableModels[provider].find(({ selected }) => selected)
    if (selectedModel) {
      return selectedModel
    }
  }
}

const Header = ({
  availableModels,
  availableSources,
  githubUrl
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
        <GithubButton url={githubUrl} mobile />
      </div>
      <div class={"flex w-full items-center justify-between gap-2 flex-wrap"}>
        <div class={"grid grid-cols-2 gap-x-[10px] mt-6 w-full md:w-fit md:flex md:items-center md:gap-x-4 md:mt-0"}>
          <div class={"w-full md:w-[162px]"}>
            <ModelsDropdown
              id="thread-model"
              prepend={
                <Icon name="brain" viewBox="0 0 16 16" />
              }
              options={availableModels}
              name="model"
              inputValue={`${getModelsDropdownInputValue(availableModels)?.label}`}
              value={`${getModelsDropdownInputValue(availableModels)?.value}`}
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
        <div class={"hidden md:flex justify-center items-center ml-auto"}>
          <GithubButton url={githubUrl} />
        </div>
      </div>
    </div>
  )
}

export default Header
