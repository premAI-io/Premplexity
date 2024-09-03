import { getActionPath } from "$routers/website/utils"
import InputPrompt from "$templates/components/InputPrompt"
import Header from "$templates/components/new-thread/Header"
import NewThreadBody from "$templates/components/new-thread/NewThreadBody"
import { SelectOption } from "$templates/components/Select"

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
      class="w-full h-[calc(100vh-60px)] pb-[60px] md:h-screen md:pb-11 flex flex-col"
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
      <Header availableModels={availableModels} availableSources={availableSources} />
      <NewThreadBody />
      <InputPrompt />
    </form>
  )
}

export default NewThreadPage
