import { defineCommand } from "citty";
import { readFile } from "fs/promises";
import { join } from "path";
import { resolve } from "pathe";
import { build } from "unbuild";

export default defineCommand({
  meta: {
    name: "build",
  },
  async run() {
    const cwd = resolve(".");

    const packageJson = await readFile(join(cwd, "package.json")).then((r) =>
      JSON.parse(r.toString()),
    );

    console.log([
      ...Object.keys(packageJson.dependencies),
      ...Object.keys(packageJson.devDependencies),
    ]);

    await build(cwd, false, {
      declaration: true,
      entries: ["src/module"],
      rollup: {
        esbuild: {
          target: "esnext",
        },
        emitCJS: false,
        cjsBridge: true,
      },
      externals: [
        ...Object.keys(packageJson.dependencies),
        ...Object.keys(packageJson.devDependencies),
      ],
    });
  },
});
