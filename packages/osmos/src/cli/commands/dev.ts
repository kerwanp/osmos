import { defineCommand } from "citty";
import { createOsmos } from "../../core/app";
import { loadOsmosConfig } from "../../config/loader";
import { createOsmosDevServer } from "../../core/dev-server";

export default defineCommand({
  meta: {
    name: "dev",
  },
  async run() {
    const config = await loadOsmosConfig({
      cwd: process.cwd(),
      overrides: {
        dev: true,
      },
    });

    const osmos = await createOsmos(config);

    await osmos.init();

    const devServer = await createOsmosDevServer(osmos);

    await devServer.listen(3131);
  },
});
