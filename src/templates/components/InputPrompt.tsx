import Button from "$templates/components/Button"
import Icon from "$templates/components/Icon"
import { formId as newThreadFormId } from "$templates/components/new-thread/NewThreadPage"

const InputPrompt = () => {
  return (
    <div class={"input-prompt__container"}>
      <textarea
        id="input-prompt-inner-container"
        class={"input-prompt__inner-container"}
        text-ellipsis-exclude
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
    </div>
  )
}

export default InputPrompt
