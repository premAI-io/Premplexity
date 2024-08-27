// --------------- SOURCE CARD TEMPLATES ---------------

import { Page, Image } from "$components/SerpAPI"

export const createSourceCard = (source: Page) => {
  const template = `
    <div class="source-card__container cursor-pointer" text-ellipsis-exclude onclick="window.open('${source.link}', '_blank')">
      <div class="source-card__content" safe>
        ${source.snippet}
      </div>
      <div class="source-card__footer">
        <div class="source-card__image">
          <img src="${source.favicon ?? "https://via.placeholder.com/150"}" class="h-full w-full object-center object-cover" />
        </div>
        <div class="source-card__source" safe>
          ${source.link}
        </div>
        <div class="source-card__id">
          ${source.order}
        </div>
      </div>
      ${createSourcePopup(source)}
    </div>
  `

  return template
}

export const createSourcePopup = (source: Page) => {
  return `
    <div class="source-popup__container" data-source-popup text-ellipsis-exclude>
      <div class="flex gap-2 items-center">
        <div class="source-card__image shrink-0">
          <img src="${source.favicon ?? "https://via.placeholder.com/150"}" alt="${source.title}" class="h-full w-full object-center object-cover">
        </div>
        <div class="flex flex-1 gap-1 items-center">
          <div class="text-xs text-gray-200 font-semibold truncate max-w-[170px]">
            ${source.link}
          </div>
          <div class="source-card__id shrink-0">1</div>
        </div>
      </div>
      <div class="source-popup__title">
        ${source.title}
      </div>
      <div class="source-popup__snippet">
        ${source.snippet}
      </div>
    </div>
  `
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
