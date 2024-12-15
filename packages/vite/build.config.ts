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
    {
      input: "src/virtual.d.ts",
      builder: "copy",
      outDir: "dist/virtual.d.ts",
    },
  ],
});
