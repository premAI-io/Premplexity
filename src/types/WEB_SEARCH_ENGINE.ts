enum WEB_SEARCH_ENGINE {
  DUCK_DUCK_GO = "DUCK_DUCK_GO",
  GOOGLE_SEARCH = "GOOGLE_SEARCH",
  GOOGLE_NEWS = "GOOGLE_NEWS",
  GOOGLE_FINANCE = "GOOGLE_FINANCE",
  GOOGLE_SCHOLAR = "GOOGLE_SCHOLAR",
  GOOGLE_PATENTS = "GOOGLE_PATENTS",
  BING_SEARCH = "BING_SEARCH",
  YAHOO_SEARCH = "YAHOO_SEARCH",
  YANDEX_SEARCH = "YANDEX_SEARCH",
}

export default WEB_SEARCH_ENGINE

export const WEB_SEARCH_ENGINE_OPTIONS = (selected?: string) => Object.values(WEB_SEARCH_ENGINE).map((source, index) => ({
  label: source.split("_").map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(" "),
  value: source,
  selected: selected ? selected === source : index === 0
}))
