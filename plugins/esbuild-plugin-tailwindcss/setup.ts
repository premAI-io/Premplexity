import autoprefixer from "autoprefixer"
import { OnLoadArgs, OnLoadResult, PluginBuild } from "esbuild"
import fs from "fs/promises"
import postcss, { AcceptedPlugin as PostcssPlugin } from "postcss"
import tailwindcss from "tailwindcss"
import { loadConfig } from "./functions/loadConfig"
import { TailwindPluginOptions } from "./types"

export const getSetup =
	({
		configPath,
		postcssPlugins: postcssUserPlugins,
	}: TailwindPluginOptions) =>
	async (build: PluginBuild) => {
		const tailwindConfig = await loadConfig(configPath)

		const onLoadCSS = async (args: OnLoadArgs): Promise<OnLoadResult> => {
      /*
        User plugins got moved to the start of the array
        otherwise tailwindcss/nesting wouldn't work
      */
			const postcssPlugins: PostcssPlugin[] = [
				...postcssUserPlugins,
        tailwindcss(tailwindConfig),
				autoprefixer,
			]
			const source = await fs.readFile(args.path, "utf8")
			const { css } = await postcss(postcssPlugins).process(source, {
				from: args.path,
			})
			return { contents: css, loader: "css" }
		}

		build.onLoad({ filter: /\.css$/ }, onLoadCSS)
	}
