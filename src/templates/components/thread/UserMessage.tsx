import Icon from "$templates/components/Icon"

type Props = {
  content: string,
  editable?: boolean
}

const UserMessage = ({
  content,
  editable = false
}: Props) => {
  return (
    <div class={"flex gap-4 justify-end my-4"}>
      {editable ?
        <Icon name={"edit"} />
        : null
      }
      <div class={"bg-gray-600 text-gray-100 text-lg font-medium py-1.5 px-3 rounded-3xl"} safe>
        {content}
      </div>
    </div>
  )
}

export default UserMessage
