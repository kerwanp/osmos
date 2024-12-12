import { defineCommand } from "citty";
import { createOsmos } from "../../core/app";
import { loadOsmosConfig } from "../../config/loader";
import { createOsmosDevServer } from "../../core/dev-server";
import { prepareOsmos } from "../../core/prepare";
import { cwdArgs } from "./_shared";
import { resolve } from "pathe";

export default defineCommand({
  meta: {
    name: "dev",
  },
  args: {
    ...cwdArgs,
  },
  async run({ args }) {
    console.log(args);
    console.log(resolve(args.cwd));
    const config = await loadOsmosConfig({
      cwd: resolve(args.cwd),
      overrides: {
        dev: true,
      },
    });

    const osmos = await createOsmos(config);

    await osmos.init();

    await prepareOsmos(osmos);

    const devServer = await createOsmosDevServer(osmos);

    await devServer.listen(3131);
  },
});
