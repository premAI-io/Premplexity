import { getPartialPath } from "$routers/website/utils"
import { ThreadComplete } from "$services/ThreadsService"
import ImagesSection from "$templates/components/thread/ImagesSection"
import SourcesSection from "$templates/components/thread/SourcesSection"
import Suggestions from "$templates/components/thread/Suggestions"
import TextSection from "$templates/components/thread/TextSection"
import UserMessage from "$templates/components/thread/UserMessage"
import THREAD_MESSAGE_STATUS from "$types/THREAD_MESSAGE_STATUS"
import { insertSourcePopup } from "$utils/thread"

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

  const lastMessageId = thread.messages[thread.messages.length - 1]?.currentMessage.id

  return (
    <div class={"overflow-y-auto scrollbar md:flex-1 mt-[130px] md:mt-0 pb-[60px] md:pb-0"}>
      <div
        id="thread-body"
        class={"thread-body"}
        {...swapOOB ? { "hx-swap-oob": swapOOB } : {}}
        data-thread-id={thread.id}
        data-sidebar-item-endpoint={getPartialPath("thread", "SIDEBAR_ITEM", { targetThreadId: thread.id })}
      >
        {
          loading && skeletonMessages && thread.messages.length === 0 ?
          <div>
            <UserMessage content={skeletonMessages.content} threadId={thread.id} />
            <SourcesSection
              threadId={thread.id}
              messageId={0}
              loading
              isCurrentMessage
              webSearchEngineType={skeletonMessages.webSearchEngineType}
              sources={[]}
            />
            <ImagesSection
              loading
              isCurrentMessage
              images={[]}
              threadId={thread.id}
              messageId={0}
            />
            <TextSection
              threadId={thread.id}
              loading
              isCurrentMessage
              assistantModel={skeletonMessages.assistantModel}
              lastMessage
              messageId={0}
            />
          </div>
          :
          thread.messages.map(({ currentMessage }) => (
            <>
            {
              currentMessage.id === lastMessageId ?
              <div id="last-message">
                <UserMessage content={currentMessage.userQuery} editable threadId={thread.id} />
                <SourcesSection
                  loading={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                  isCurrentMessage={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                  webSearchEngineType={currentMessage.webSearchEngineType}
                  sources={currentMessage.sources.pages}
                  threadId={thread.id}
                  messageId={currentMessage.id}
                  lastMessage={!(loading && skeletonMessages && thread.messages.length === 0)}
                />
                <ImagesSection
                  loading={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                  isCurrentMessage={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                  images={currentMessage.sources.images}
                  threadId={thread.id}
                  messageId={currentMessage.id}
                  lastMessage={!(loading && skeletonMessages && thread.messages.length === 0)}
                />
                <TextSection
                  threadId={thread.id}
                  loading={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                  isCurrentMessage={loading ?? currentMessage.status === THREAD_MESSAGE_STATUS.PENDING}
                  assistantModel={currentMessage.assistantModel}
                  assistantError={currentMessage.assistantError}
                  assistantResponse={insertSourcePopup(currentMessage.assistantResponse ?? "", currentMessage.sources.pages)}
                  lastMessage={!(loading && skeletonMessages && thread.messages.length === 0)}
                  messageId={currentMessage.id}
                  errorData={currentMessage.errorData}
                />
                {loading ?
                  <></> :
                  <Suggestions message={currentMessage} />
                }
              </div>
              :
              <div>
                <UserMessage content={currentMessage.userQuery} threadId={thread.id} />
                <SourcesSection
                  webSearchEngineType={currentMessage.webSearchEngineType}
                  sources={currentMessage.sources.pages}
                  threadId={thread.id}
                  messageId={currentMessage.id}
                />
                <ImagesSection
                  images={currentMessage.sources.images}
                  threadId={thread.id}
                  messageId={currentMessage.id}
                />
                <TextSection
                  threadId={thread.id}
                  assistantModel={currentMessage.assistantModel}
                  assistantError={currentMessage.assistantError}
                  assistantResponse={insertSourcePopup(currentMessage.assistantResponse ?? "", currentMessage.sources.pages)}
                  messageId={currentMessage.id}
                  errorData={currentMessage.errorData}
                />
              </div>
            }
            </>
          )).reverse()
        }
      </div>
    </div>
  )
}

export default ThreadBody
