import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  declaration: true,
  entries: [
    { input: "src/", outDir: "dist/" },
    // "src/index",
    // "src/cli/index",
    // "src/config/index",
    // "src/module/index",
    // "src/runtime/rsc/handler.tsx",
    // "src/runtime/ssr/handler",
    // "src/runtime/client/entry.tsx",
    // "src/nitro/plugins/app-handler",
    // "src/router/browser/link.tsx",
    {
      input: "src/config/schema/index",
      builder: "untyped",
      name: "config",
      outDir: "schema",
    },
  ],
  hooks: {
    "mkdist:entry:options"(_ctx, _entry, mkdistOptions) {
      mkdistOptions.addRelativeDeclarationExtensions = true;
    },
  },
  clean: false,
  failOnWarn: false,
});
