import { getActionPath } from "$routers/website/utils"
import InputPrompt from "$templates/components/InputPrompt"
import Header from "$templates/components/new-thread/Header"
import NewThreadBody from "$templates/components/new-thread/NewThreadBody"
import { SelectOption } from "$templates/components/Select"

type Props = {
  availableModels: Record<string, SelectOption[]>
  availableSources: SelectOption[]
  githubUrl: string
}

export const formId = "thread-form"

const NewThreadPage = ({
  availableModels,
  availableSources,
  githubUrl
}: Props) => {
  return (
    <form
      id={formId}
      class="w-full h-[calc(100vh-70px)] pb-[70px] md:h-screen md:pb-11 flex flex-col"
      action={getActionPath("thread", "CREATE")}
      method="post"
      hx-target={`#sidebar,#${formId}`}
      hx-swap="none"
      hx-push-url="false"
      hx-boost="true"
      data-new-thread-page
      {...{
        "hx-on::after-request": "onPromptSubmit()",
      }}
    >
      <Header availableModels={availableModels} availableSources={availableSources} githubUrl={githubUrl} />
      <NewThreadBody />
      <InputPrompt />
    </form>
  )
}

export default NewThreadPage
