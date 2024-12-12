import { defineCommand } from "citty";
import { createOsmos } from "../../core/app";
import { loadOsmosConfig } from "../../config/loader";
import { prepareOsmos } from "../../core/prepare";

export default defineCommand({
  meta: {
    name: "prepare",
  },
  async run() {
    const options = await loadOsmosConfig({ cwd: process.cwd() });
    const osmos = await createOsmos(options);

    await osmos.init();

    await prepareOsmos(osmos);
  },
});
