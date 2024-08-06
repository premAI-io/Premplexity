import Configs from "$components/Configs"
import { BaseResponse } from "node_modules/serpapi/script/mod"
import { getJson } from "serpapi"
import { container, inject, singleton } from "tsyringe"
import WEB_SEARCH_ENGINE from "$types/WEB_SEARCH_ENGINE"

export type SearchResults = {
  pages: Page[],
  images: Image[],
  relatedSearches: RelatedSearch[]
}

export type Page = {
  order: number,
  title: string,
  link: string,
  snippet: string,
  favicon: string,
}

export type Image = {
  title: string,
  link: string,
  thumbnail: string,
  image: string
}

export type RelatedSearch = {
  query: string,
  link: string
}
@singleton()
export default class SerpAPI {
  readonly #apiKey: string

  constructor(
    @inject(Configs.token)
    configs: Configs
  ) {
    this.#apiKey = configs.env.SERPAPI_KEY

    // this.search({ query: "come si chiama il presidente degli stati uniti", engine: WEB_SEARCH_ENGINE.GOOGLE_NEWS })
  }

  private _parseGoogle(data: BaseResponse, max_results?: number): SearchResults {
    const out: SearchResults = {
      pages: data.organic_results?.reduce((acc: Page[], r: Record<string, string>, i: number) => {
        if (max_results && i >= max_results) {
          return acc
        }

        acc.push({
          order: i,
          title: r.title,
          link: r.link,
          snippet: r.snippet,
          favicon: r.favicon
        })
        return acc
      }, []) || [],
      images: data.inline_images?.reduce((acc: Image[], r: Record<string, string>, i: number) => {
        if (max_results && i >= max_results) {
          return acc
        }

        acc.push({
          title: r.title,
          link: r.link,
          thumbnail: r.thumbnail,
          image: r.original
        })
        return acc
      }, []) || [],
      relatedSearches: data.related_questions?.reduce((acc: RelatedSearch[], r: Record<string, string>) => {
        acc.push({
          query: r.question,
          link: r.link
        })
        return acc
      }, []) || []
    }

    return out
  }

  private _parseDuckDuckGo(data: BaseResponse, max_results?: number): SearchResults {
    const out: SearchResults = {
      pages: data.organic_results?.reduce((acc: Page[], r: Record<string, string>, i: number) => {
        if (max_results && i >= max_results) {
          return acc
        }

        acc.push({
          order: i,
          title: r.title,
          link: r.link,
          snippet: r.snippet,
          favicon: r.favicon
        })
        return acc
      }, []) || [],
      images: data.inline_images?.reduce((acc: Image[], r: Record<string, string>, i: number) => {
        if (max_results && i >= max_results) {
          return acc
        }

        acc.push({
          title: r.title,
          link: r.link,
          thumbnail: r.thumbnail,
          image: r.image
        })
        return acc
      }, []) || [],
      relatedSearches: data.related_searches?.reduce((acc: RelatedSearch[], r: Record<string, string>) => {
        acc.push({
          query: r.query,
          link: r.link
        })
        return acc
      }, []) || []
    }

    return out
  }

  private _parseGoogleNews(data: BaseResponse, max_results?: number): SearchResults {
    console.dir(data, { depth: null })

    const out: SearchResults = {
      pages: data.organic_results?.reduce((acc: Page[], r: Record<string, string>, i: number) => {
        if (max_results && i >= max_results) {
          return acc
        }

        acc.push({
          order: i,
          title: r.title,
          link: r.link,
          snippet: r.snippet,
          favicon: r.favicon
        })
        return acc
      }, []) || [],
      images: data.inline_images?.reduce((acc: Image[], r: Record<string, string>, i: number) => {
        if (max_results && i >= max_results) {
          return acc
        }

        acc.push({
          title: r.title,
          link: r.link,
          thumbnail: r.thumbnail,
          image: r.image
        })
        return acc
      }, []) || [],
      relatedSearches: data.related_searches?.reduce((acc: RelatedSearch[], r: Record<string, string>) => {
        acc.push({
          query: r.query,
          link: r.link
        })
        return acc
      }, []) || []
    }

    return out

  }
  async search({ query, engine, max_results }: { query: string, engine: WEB_SEARCH_ENGINE, max_results?: number }): Promise<SearchResults> {
    let serpAPIEngine

    switch (engine) {
      case WEB_SEARCH_ENGINE.GOOGLE_SEARCH:
        serpAPIEngine = "google"
        break
      case WEB_SEARCH_ENGINE.DUCK_DUCK_GO:
        serpAPIEngine = "duckduckgo"
        break
      case WEB_SEARCH_ENGINE.GOOGLE_NEWS:
        throw new Error("Google News is not supported")
        serpAPIEngine = "google_news"
        break
      case WEB_SEARCH_ENGINE.GOOGLE_FINANCE:
        throw new Error("Google Finance is not supported")
        serpAPIEngine = "google_finance"
        break
      case WEB_SEARCH_ENGINE.GOOGLE_SCHOLAR:
        throw new Error("Google Scholar is not supported")
        serpAPIEngine = "google_scholar"
        break
      case WEB_SEARCH_ENGINE.GOOGLE_PATENTS:
        throw new Error("Google Patents is not supported")
        serpAPIEngine = "google_patents"
        break
      case WEB_SEARCH_ENGINE.BING_SEARCH:
        throw new Error("Bing Search is not supported")
        serpAPIEngine = "bing"
        break
      case WEB_SEARCH_ENGINE.YAHOO_SEARCH:
        throw new Error("Yahoo Search is not supported")
        serpAPIEngine = "yahoo"
        break
      case WEB_SEARCH_ENGINE.YANDEX_SEARCH:
        throw new Error("Yandex Search is not supported")
        serpAPIEngine = "yandex"
        break
      default:
        throw new Error("Invalid search engine")
    }

    const data = await getJson({
      api_key: this.#apiKey,
      engine: serpAPIEngine,
      q: query,
    })

    switch (engine) {
      case WEB_SEARCH_ENGINE.GOOGLE_SEARCH:
        return this._parseGoogle(data, max_results)
      case WEB_SEARCH_ENGINE.DUCK_DUCK_GO:
        return this._parseDuckDuckGo(data, max_results)
      // case WEB_SEARCH_ENGINE.GOOGLE_NEWS:
      //   return this._parseGoogleNews(data, max_results)
    }
  }

  static token = Symbol("SerpAPI")
}

container.registerSingleton(SerpAPI.token, SerpAPI)
