import { ThreadComplete } from "$services/ThreadsService"
import ImagesSection from "$templates/components/thread/ImagesSection"
import SourcesSection from "$templates/components/thread/SourcesSection"
import TextSection from "$templates/components/thread/TextSection"
import UserMessage from "$templates/components/thread/UserMessage"
import THREAD_MESSAGE_STATUS from "$types/THREAD_MESSAGE_STATUS"

type Props = {
  swapOOB?: string,
  loading?: boolean,
  thread: ThreadComplete
  skeletonMessages?: {
    content: string,
    assistantModel: string,
    webSearchEngineType: string
  }
}

const ThreadBody = ({
  swapOOB,
  loading = false,
  thread,
  skeletonMessages
}: Props) => {

  return (
    <div
      id="thread-body"
      class={"flex-1 flex flex-col-reverse text-center max-w-[813px] w-[75%] mx-auto overflow-y-auto px-2 pb-4 scrollbar"}
      {...swapOOB ? { "hx-swap-oob": swapOOB } : {}}
      data-thread-id={thread.id}
    >
      {
        loading && skeletonMessages && thread.messages.length === 0 ?
        <div>
          <UserMessage content={skeletonMessages.content} />
          <SourcesSection
            loading
            isCurrentMessage
            webSearchEngineType={skeletonMessages.webSearchEngineType}
            sources={[]}
          />
          <ImagesSection
            loading
            isCurrentMessage
            images={[]}
          />
          <TextSection
            loading
            isCurrentMessage
            assistantModel={skeletonMessages.assistantModel}
          />
        </div>
        :
        thread.messages.map(({ history, currentMessage }) => (
          <>
            {
              history.slice(0, history.length - 1).map(message => (
                <div>
                  <UserMessage content={message.userQuery} />
                  <SourcesSection
                    webSearchEngineType={message.webSearchEngineType}
                    sources={message.sources.pages}
                  />
                  <ImagesSection
                    images={message.sources.images}
                  />
                  <TextSection
                    assistantModel={message.assistantModel}
                    assistantError={message.assistantError}
                    assistantResponse={message.assistantResponse}
                  />
                </div>
              ))
            }
            <div>
              <UserMessage content={currentMessage.userQuery} />
              <SourcesSection
                loading={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                isCurrentMessage={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                webSearchEngineType={currentMessage.webSearchEngineType}
                sources={currentMessage.sources.pages}
              />
              <ImagesSection
                loading={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                isCurrentMessage={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                images={currentMessage.sources.images}
              />
              <TextSection
                loading={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                isCurrentMessage={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                assistantModel={currentMessage.assistantModel}
                assistantError={currentMessage.assistantError}
                assistantResponse={currentMessage.assistantResponse}
              />
            </div>
          </>
        )).reverse()
      }
    </div>
  )
}

export default ThreadBody
