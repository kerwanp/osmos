import { defineBuildConfig } from "unbuild";
import { dependencies, devDependencies } from "./package.json";

export default defineBuildConfig({
  declaration: true,
  entries: ["src/index", "src/server/index", "src/vite/main"],
  externals: [...Object.keys(dependencies), ...Object.keys(devDependencies)],
  rollup: {
    esbuild: {
      jsx: "automatic",
    },
  },
});
