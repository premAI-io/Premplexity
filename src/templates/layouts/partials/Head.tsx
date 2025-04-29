import { GlobalResources } from "$types/index"

type Props = {
  globalResources: GlobalResources
}

const Head = ({
  globalResources
}: Props) => {
  return (
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href={globalResources.ESBUILD_STYLE_BUNDLE_PATH}
      />
      <link id="favicon" rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/android-chrome-192x192.png"
      />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <script src={globalResources.ESBUILD_SCRIPT_BUNDLE_PATH}></script>
      <meta name="description" content="Premplexity - Open-source AI search assistant where you own your data, powered by Prem" />
      <meta name="keywords" content="AI search, open source, data privacy, Prem, Premplexity, perplexity alternative" />
      <meta name="author" content="Prem" />

      <meta property="og:title" content="Premplexity - Own Your AI Search Experience" />
      <meta property="og:description" content="Open-source AI search assistant where you control your data, powered by Prem" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://premplexity.ai" />
      <meta property="og:image" content="/android-chrome-192x192.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Premplexity - Open Source AI Search" />
      <meta name="twitter:description" content="AI search where you own your data, powered by Prem" />
      <meta name="twitter:image" content="/android-chrome-192x192.png" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      ></link>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    </head>
  )
}

export default Head
