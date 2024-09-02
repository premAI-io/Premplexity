import { ThreadMessageComplete } from "$services/ThreadMessagesService"
import ThreadImageCard from "$templates/components/thread/ImageCard"
import classNames from "classnames"

type Props = {
  loading?: boolean,
  images: ThreadMessageComplete["sources"]["images"]
  isCurrentMessage?: boolean
  threadId: number
  messageId: number
  lastMessage?: boolean
}

const ImagesSection = ({
  loading,
  images,
  isCurrentMessage,
  threadId,
  messageId,
  lastMessage = false
}: Props) => {
  if (!loading && images.length === 0) {
    return null
  }

  return (
    <>
      <div
        {...lastMessage ? {
          id: "thread-images-title"
        } : {}}
        class={classNames("font-semibold mt-4 text-sm text-left",{
          "!hidden": loading
        })}
        {...isCurrentMessage ? {
          "data-current-message": ""
          } : {}
        }
      >
        Related images
      </div>
      <div
        {...lastMessage ? {
          id: "thread-images-container"
        } : {}}
        class={"pt-2"}
        {...isCurrentMessage ? {
          "data-current-message": ""
          } : {}
        }
      >
        <div
          {...lastMessage ? {
            id: "thread-images"
          } : {}}
          class={classNames("thread_images_grid",{
            "!hidden": loading
          })}
        >
          {
              images.slice(0, 6).map(image => (
                <ThreadImageCard
                  image={image.thumbnail}
                  messageId={messageId}
                  threadId={threadId}
                  imageOrder={image.order}
                />
              ))
          }
        </div>
      </div>
    </>
  )
}

export default ImagesSection
