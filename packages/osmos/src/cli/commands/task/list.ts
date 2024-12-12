import { defineCommand } from "citty";
import { createOsmos } from "../../../core/app";
import { loadOsmosConfig } from "../../../config/loader";
import { listTasks } from "nitropack";

export default defineCommand({
  meta: {
    name: "list",
  },
  async run() {
    const options = await loadOsmosConfig({ cwd: process.cwd() });
    const app = await createOsmos(options);

    await app.init();

    const res = await listTasks({
      cwd: process.cwd(),
      buildDir: options.buildDir,
    });

    console.log(res);
  },
});
