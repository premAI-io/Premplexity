import Button from "$templates/components/Button"
import Icon from "$templates/components/Icon"

type Props = {
  swapOOB?: string
}

const NewThreadButton = ({
  swapOOB
}: Props) => {
  return (
    <a href="/" hx-target="#page" hx-swap="outerHTML" hx-boost="true" hx-push-url="true" {...swapOOB ? { "hx-swap-oob": swapOOB } : {}}>
      <Button theme="secondary" type="button">
        <Icon name="plus" />
        New
      </Button>
    </a>
  )
}

export default NewThreadButton
