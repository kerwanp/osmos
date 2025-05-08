import { defineBuildConfig } from "unbuild";
import { dependencies, devDependencies } from "./package.json";

export default defineBuildConfig({
  declaration: true,
  clean: false,
  entries: [
    "src/index",
    "src/server/index",
    "src/vite/main",
    "src/client/main",
  ],
  externals: [...Object.keys(dependencies), ...Object.keys(devDependencies)],
  rollup: {
    esbuild: {
      jsx: "automatic",
    },
  },
});
