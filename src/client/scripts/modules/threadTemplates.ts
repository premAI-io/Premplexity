// --------------- SOURCE CARD TEMPLATES ---------------

import { Page, Image } from "$components/SerpAPI"

export const createSourceCard = (source: Page) => {
  const template = `
    <div class="source-card__container">
      <div class="source-card__content" safe>
        ${source.snippet}
      </div>
      <div class="source-card__footer">
        <div class="source-card__image">
          <img src="${source.favicon ?? "https://via.placeholder.com/150"}" class="h-full w-full object-center object-cover" />
        </div>
        <a class="source-card__source" href="${source.link}" data-tooltip-break-word safe target="_blank">
          ${source.link}
        </a>
        <div class="source-card__id">
          ${source.order}
        </div>
      </div>
    </div>
  `

  return template
}

export const createViewMoreCard = () => {
  return `
    <div class="source-card__container bg-gray-600 !justify-between !p-0">
      <div class="text-left pt-[8.5px] pl-[4.75px]">
        <svg width="16" height="16" viewBox="0 0 20 20" role="img"><use href="#book"></use></svg>
      </div>
      <div class="text-right pb-1 pr-2 text-xs">
        View more
      </div>
    </div>
  `
}

// --------------- IMAGE CARD TEMPLATES ---------------

export const createImageCard = (image: Image) => {
  const template = `
    <div class="image-card-container">
      <img src="${image.thumbnail}" class="h-full w-full object-center object-cover" />
    </div>
  `

  return template
}
