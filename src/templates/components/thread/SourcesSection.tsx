import { ThreadMessageComplete } from "$services/ThreadMessagesService"
import Icon from "$templates/components/Icon"
import SourcesLoading from "$templates/components/loaders/SourceLoading"
import SourceCard from "$templates/components/thread/SourceCard"
import { WEB_SEARCH_ENGINE_OPTIONS } from "$types/WEB_SEARCH_ENGINE"
import classNames from "classnames"

type Props = {
  loading?: boolean,
  webSearchEngineType: string | null,
  sources: ThreadMessageComplete["sources"]["pages"]
  isCurrentMessage?: boolean
}

const SourcesSection = ({
  loading,
  webSearchEngineType,
  sources,
  isCurrentMessage
}: Props) => {
  return (
    <>
      <div class={"flex-container !gap-x-3 text-sm"}>
        <div class={"font-semibold"}>Sources</div>
        <div class={"flex-container !gap-x-2 text-gray-400"}>
          <Icon name="globe" viewBox="0 0 16 16" />
          <span safe>{WEB_SEARCH_ENGINE_OPTIONS().find(e => e.value === webSearchEngineType)?.label}</span>
        </div>
      </div>
      <div id="thread-sources-container" class={"pt-2"} {...isCurrentMessage ? {
        "data-current-message": ""
        } : {}
      }>
        <div id="thread-sources-loader" class={classNames({
          "!hidden": !loading
        })}>
          <SourcesLoading />
        </div>
        <div id="thread-sources" class={classNames("thread_sources_grid", {
          "!hidden": loading
        })}>
          {
            sources.length > 5 ?
            sources.slice(0, 4).map(({ snippet, link, favicon, order }) => (
              <SourceCard
                content={snippet ?? ""}
                source={link ?? ""}
                id={order}
                image={favicon ?? undefined}
              />
            ))
            :
            sources.map(({ snippet, link, favicon, order }) => (
              <SourceCard
                content={snippet ?? ""}
                source={link ?? ""}
                id={order}
                image={favicon ?? undefined}
              />
            ))
          }
          {
            sources.length > 5 ?
              <SourceCard
                isViewMore
              />
            : null
          }
        </div>
      </div>
    </>
  )
}

export default SourcesSection
