import {
  FastifyInstance,
  FastifyBaseLogger,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault
} from "fastify"

import {
  JsonSchemaToTsProvider,
} from "@fastify/type-provider-json-schema-to-ts"

export type GlobalResources = {
  FAVICON_PATH: string,
  ESBUILD_STYLE_BUNDLE_PATH: string
  ESBUILD_SCRIPT_BUNDLE_PATH: string
  IS_MOBILE: boolean
  GITHUB_REPO_URL: string
}

export type LayoutProps = {
  children: JSX.Element,
  globalResources: GlobalResources,
  isHtmxRequest: boolean
  routerName: string
}
export type LayoutFn = (props: LayoutProps) => JSX.Element

export type FastifyJsonSchemaInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  JsonSchemaToTsProvider
>

export type RegisterRoutes = (server: FastifyJsonSchemaInstance) => void
