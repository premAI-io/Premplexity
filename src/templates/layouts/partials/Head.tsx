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
      <script src={globalResources.ESBUILD_SCRIPT_BUNDLE_PATH}></script>
      <meta name="description" content="Welcome" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="True"
      />
      <link
        rel="preload"
        href="https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2"
        as="font"
        type="font/woff2"
        crossorigin="True"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      ></link>
      <script type="text/javascript">
        {`
          var onloadCallback = function() {
            window.recaptcha.recaptchaV2onLoad(window.grecaptcha, "${globalResources.RECAPTCHA_V2_SITE_KEY}")
          }
        `}
      </script>
      <script src={`https://www.google.com/recaptcha/api.js?render=${globalResources.RECAPTCHA_V3_SITE_KEY}`}></script>
      <script>
        {`
          window.RECAPTCHA_V2_SITE_KEY = "${globalResources.RECAPTCHA_V2_SITE_KEY}"
          window.RECAPTCHA_V3_SITE_KEY = "${globalResources.RECAPTCHA_V3_SITE_KEY}"
        `}
      </script>
    </head>
  )
}

export default Head
