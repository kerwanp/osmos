import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  declaration: true,
  entries: [
    {
      input: "src/config/schema/index",
      builder: "untyped",
      name: "config",
      outDir: "schema",
    },
  ],
  clean: false,
  failOnWarn: false,
});
