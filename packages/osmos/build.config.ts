import { BuildEntry, defineBuildConfig } from "unbuild";
import { dependencies, devDependencies } from "./package.json";

export default defineBuildConfig({
  declaration: true,
  entries: [
    "src/index",
    "src/cli/index",
    "src/config/index",
    "src/module/index",
    ...["ssr", "server", "client", "nitro", "router"].map(
      (name) =>
        ({
          input: `src/${name}/runtime/`,
          outDir: `dist/${name}/runtime/`,
          format: "esm",
          ext: "js",
          esbuild: {
            jsx: "automatic",
          },
        }) as BuildEntry,
    ),
    {
      input: "src/config/schema/index",
      builder: "untyped",
      name: "config",
      outDir: "schema",
    },
  ],
  // hooks: {
  //   "mkdist:entry:options"(_ctx, _entry, mkdistOptions) {
  //     mkdistOptions.addRelativeDeclarationExtensions = true;
  //   },
  // },
  externals: [...Object.keys(dependencies), ...Object.keys(devDependencies)],
  rollup: {
    esbuild: {
      jsx: "automatic",
    },
  },
});
