import { defineCommand } from "citty";
import { loadOsmosConfig } from "../../config/loader";
import { relative, resolve } from "pathe";
import { stat } from "fs/promises";
import { createOsmos } from "../../core/app";
import { execa } from "execa";

export default defineCommand({
  meta: {
    name: "start",
  },
  async run() {
    const config = await loadOsmosConfig({
      cwd: process.cwd(),
    });

    const app = await createOsmos(config);

    await app.init();

    const entryPath = resolve(app.nitro.options.output.serverDir, "index.mjs");

    const exist = await stat(entryPath)
      .then(() => true)
      .catch(() => false);

    const relativePath = relative(app.options.rootDir, entryPath);

    if (!exist) {
      app.logger.error(
        `The file ${relativePath} does not exist: Your app must be built to start it`,
      );
      return;
    }

    execa({
      cwd: app.options.rootDir,
      stdout: ["pipe", "inherit"],
    })`node ${entryPath}`;
  },
});
