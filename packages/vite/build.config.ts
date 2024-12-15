import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  declaration: true,
  entries: [
    "src/index",
    {
      input: "src/types.d.ts",
      builder: "copy",
      outDir: "dist/types.d.ts",
    },
  ],
});
