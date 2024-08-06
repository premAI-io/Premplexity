import Button from "$templates/components/Button"
import Icon from "$templates/components/Icon"
import { formId as newThreadFormId } from "$templates/components/new-thread/NewThreadPage"
import PremLogo from "$templates/components/PremLogo"
import Spinner from "$templates/components/Spinner"

type Props = {
  loading?: boolean
}

const InputPrompt = ({
  loading
}: Props) => {
  return (
    <>
      <div class="fixed md:hidden bottom-[40px] w-[calc(100%-2rem)] mx-4 h-[70px] bg-gray-800" />
      <div class={"input-prompt__container"}>
        <textarea
          id="input-prompt-inner-container"
          class={"input-prompt__inner-container"}
          text-ellipsis-exclude
          {...loading ? { "data-response-loading": true } : {}}
          name="inputPrompt"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          oninput={"onInputPromptInput(event)"}
          onkeydown={"onInputPromptKeydown(event)"}
        ></textarea>
        <Button
          id="input-prompt-submit"
          theme="primary"
          class="!w-7 !h-7 md:!w-9 md:!h-9 !p-0 flex items-center justify-center !absolute bottom-[6.5px] right-[8px] md:bottom-[10px] md:right-[10px]"
          type="submit"
          form={newThreadFormId}
          disabled
        >
          <Icon name="arrow-up" />
        </Button>
        <Button
          id="input-prompt-stop"
          theme="primary"
          class="!w-7 !h-7 md:!w-9 md:!h-9 !p-0 flex items-center justify-center !absolute bottom-[6.5px] right-[8px] md:bottom-[10px] md:right-[10px]"
          type="button"
          onclick="blockExecution()"
        >
          <div data-spinner class={"flex items-center justify-center"}>
            <Spinner class="!w-6 !h-6 !absolute" />
            <div class={"w-3 h-3 rounded-sm bg-[currentColor] !absolute"} />
          </div>
        </Button>
      </div>
      <div class={"md:hidden fixed bottom-[60px] w-full"}>
        <a href="https://premai.io" class={"flex w-fit mx-auto items-center gap-2 text-xs"} target="_blank" rel="noreferrer">
          Powered by PremAI
          <PremLogo mobile />
        </a>
      </div>
    </>
  )
}

export default InputPrompt
