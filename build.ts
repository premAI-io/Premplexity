import esbuild, { Loader, Platform, Plugin } from "esbuild"
import { writeFileSync } from "fs"
import { join } from "path"
import { tailwindPlugin } from "./plugins/esbuild-plugin-tailwindcss/index"
import { typecheckPlugin } from "@jgoz/esbuild-plugin-typecheck"
import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin"

const clientConfigs = {
  entryPoints: ["src/client/scripts/index.ts", "src/client/styles/index.css", "src/client/favicon.ico"],
  entryNames: "[dir]/[name]-[hash]",
  bundle: true,
  minify: true,
  sourcemap: true,
  metafile: true,
  target: ["chrome58", "firefox57", "safari11", "edge18"],
  outdir: "dist/public",
  loader: { ".ico": "copy" as Loader },
  plugins: [
    tailwindPlugin({
      configPath: join(process.cwd(), "tailwind.config.js"),
      postcssPlugins: [
        require("tailwindcss/nesting"),
        require("postcss-import"),
      ]
    })
  ]
}

const serverConfigs = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node" as Platform,
  outdir: "dist",
  sourcemap: true,
  loader: {
    ".node": "copy" as Loader
  },
  plugins: [] as Plugin[]
}

if (process.env.SKIP_TYPECHECK !== "true") {
  serverConfigs.plugins.push(typecheckPlugin())
}

const {
  ENVIRONMENT,
  SENTRY_AUTH_TOKEN,
  SENTRY_VERSION
} = process.env

if (["production", "staging"].includes(ENVIRONMENT) && SENTRY_AUTH_TOKEN && SENTRY_VERSION) {
  const sentryPlugin = sentryEsbuildPlugin({
    org: "prem",
    project: "premplexity",
    authToken: SENTRY_AUTH_TOKEN,
    telemetry: false,
    release: {
      name: SENTRY_VERSION,
      setCommits: {
        auto: true,
        ignoreMissing: true
      },
      finalize: true
    }
  })

  serverConfigs.plugins.push(sentryPlugin)
}

void (async () => {
  // Build client first to get metafile and write it to server
  const clientResult = await esbuild.build(clientConfigs)
  writeFileSync(join(__dirname, "src/meta.json"), JSON.stringify(clientResult.metafile, null, 2))

  await esbuild.build(serverConfigs)
})()
