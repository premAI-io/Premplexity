import Button from "$templates/components/Button"
import Icon from "$templates/components/Icon"

type Props = {
  mobile?: boolean
}

const NewThreadButton = ({
  mobile
}: Props) => {
  return (
    <Button
      hx-get="/"
      hx-target="#page"
      hx-swap="outerHTML"
      theme="secondary"
      type="submit"
      hx-include="input[name='model'],input[name='searchEngine']"
      hx-push-url="/"
      class={`flex items-center gap-2 ${mobile ? "!px-[14px] !py-2" : ""}`}
    >
      <Icon name="plus" />
      {mobile ? "" : "New"}
    </Button>
  )
}

export default NewThreadButton
