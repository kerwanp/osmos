import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import preserveDirectives from "rollup-plugin-preserve-directives";

export default defineConfig({
  input: {
    index: "src/index.ts",
    "cli/index": "src/cli/index.ts",
    "config/index": "src/config/index.ts",
    "module/index": "src/module/index.ts",
    "runtime/rsc/handler": "src/runtime/rsc/handler.tsx",
    "runtime/ssr/handler": "src/runtime/ssr/handler.ts",
    "runtime/client/entry": "src/runtime/client/entry.tsx",
    "nitro/plugins/app-handler": "src/nitro/plugins/app-handler.ts",
    "router/browser/link": "src/router/browser/link.tsx",
  },
  output: {
    dir: "dist",
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: "src",
    format: "esm",
  },
  plugins: [
    typescript(),
    preserveDirectives({ suppressPreserveModulesWarning: true }),
  ],
});
