const path = require("path");
const packageJson = require("./package.json");
const { defineConfig } = require("@rspack/cli");

const externals = [
	...new Set([
		...Object.keys(packageJson.dependencies),
		...Object.keys(packageJson.peerDependencies),
	]).values(),
].reduce(
	(acc, obj) => ({
		...acc,
		[obj]: obj,
	}),
	{},
);


module.exports = defineConfig({
	entry: {
		main: "./src/index.ts",
	},
	externals: {
        ...externals,
        swr: "swr",
    },
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist"),
	},
});
