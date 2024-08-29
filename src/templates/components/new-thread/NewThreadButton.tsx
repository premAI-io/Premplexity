import Button from "$templates/components/Button"
import Icon from "$templates/components/Icon"

type Props = {
  swapOOB?: string
}

const NewThreadButton = ({
  swapOOB
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
      {...swapOOB ? { "hx-swap-oob": swapOOB } : {}}
    >
      <Icon name="plus" />
      New
    </Button>
  )
}

export default NewThreadButton
