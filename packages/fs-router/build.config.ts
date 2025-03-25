import { defineBuildConfig } from "unbuild";
import { dependencies, devDependencies } from "./package.json";

export default defineBuildConfig({
  declaration: true,
  entries: ["src/index", "src/vite/main", "src/types"],
  externals: [...Object.keys(dependencies), ...Object.keys(devDependencies)],
  rollup: {
    esbuild: {
      jsx: "automatic",
    },
  },
});
