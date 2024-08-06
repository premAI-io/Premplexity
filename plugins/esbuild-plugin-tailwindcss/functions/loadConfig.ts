export const loadConfig = async (configPath: string) => {
	const isESM = !(typeof module !== "undefined" && module.exports)
	const isWindows = process.platform === "win32"
	const hasFilePrefix = configPath.startsWith("file://")
	if (isWindows && isESM && !hasFilePrefix) configPath = `file://${configPath}`
	const imported = await import(configPath)
	return (isESM || imported.default) ? imported.default : imported
}
