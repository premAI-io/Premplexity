import { LayoutProps } from "$types"
import Head from "./partials/Head"
import Body from "./partials/Body"
import { ErrorBoundary } from "@kitajs/html/error-boundary"
import Page from "./partials/Page"

const BaseLayout = ({
  children,
  globalResources,
  isHtmxRequest
}: LayoutProps) => {
  return (
    <ErrorBoundary catch={err => (
      <div safe>{`${err}`}</div>
    )}>
      {isHtmxRequest
        ? <Page isMobile={globalResources.IS_MOBILE}>{children}</Page>
        :
        <>
          {"<!DOCTYPE html>"}
          <html lang="en">
            <Head globalResources={globalResources} />

            <Body>
              <Page isMobile={globalResources.IS_MOBILE}>
                {children}
              </Page>
            </Body>
          </html>
        </>
      }
    </ErrorBoundary>
  )
}

export default BaseLayout
