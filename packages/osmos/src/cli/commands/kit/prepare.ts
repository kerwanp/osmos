import { defineCommand } from "citty";
import { resolve } from "pathe";
import { build } from "unbuild";

export default defineCommand({
  meta: {
    name: "prepare",
  },
  async run() {
    const cwd = resolve(".");
    await build(cwd, true, {
      declaration: true,
      entries: ["src/module"],
      rollup: {
        esbuild: {
          target: "esnext",
        },
        emitCJS: false,
        cjsBridge: true,
      },
      externals: ["@osmosjs/osmos"],
    });
  },
});
