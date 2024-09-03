import { Page } from "$components/SerpAPI"
import Icon from "$templates/components/Icon"
import Modal from "$templates/components/Modal"
import { WEB_SEARCH_ENGINE_OPTIONS } from "$types/WEB_SEARCH_ENGINE"

type Props = {
  webSearchEngineType?: string | null
  sources: Page[]
}

const SourcesModal = ({
  webSearchEngineType,
  sources
}: Props) => {
  return (
    <Modal
      id={"thread-sources-modal"}
      ariaLabelledby="thread-sources-title"
      title="Sources"
      isOpen={true}
      closable={true}
      size="lg"
      {...{
        ["hx-on::load"]: "htmx.process(event.detail.elt)"
      }}
    >
      {webSearchEngineType ?
        <div class={"flex-container !gap-x-2 text-gray-400 mb-4"}>
          <Icon name="globe" viewBox="0 0 16 16" />
          <span safe>{WEB_SEARCH_ENGINE_OPTIONS().find(e => e.value === webSearchEngineType)?.label}</span>
        </div>
        : null
      }
      <div class={"flex flex-col gap-4"} text-ellipsis-exclude>
        {
          sources.map(({ snippet, link, favicon, order }) => (
            <div class={"sources-modal__item-container"} onclick={`window.open("${link}", "_blank")`}>
              <div class={"sources-modal__item-text"} safe>
                {snippet}
              </div>
              <div class={"source-card__footer !justify-start mt-2"}>
                <div class={"source-card__image"}>
                  <img src={favicon ?? "https://via.placeholder.com/150"} class={"h-full w-full object-center object-cover"} />
                </div>
                <div class={"source-card__source max-w-[150px] md:max-w-[300px] !block"} safe>
                  {link}
                </div>
                <div class={"source-card__id"}>
                  {order}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </Modal>
  )
}

export default SourcesModal
