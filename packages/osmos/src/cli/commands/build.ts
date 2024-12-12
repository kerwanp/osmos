import { defineCommand } from "citty";
import { createOsmos } from "../../core/app";
import { loadOsmosConfig } from "../../config/loader";
import { buildOsmos } from "../../core/build";
import { prepareOsmos } from "../../core/prepare";

export default defineCommand({
  meta: {
    name: "build",
  },
  async run() {
    const config = await loadOsmosConfig({
      cwd: process.cwd(),
    });

    const osmos = await createOsmos(config);

    await osmos.init();

    await prepareOsmos(osmos);
    await buildOsmos(osmos);
  },
});
