import { fileURLToPath } from "mlly";
import defineModule from "../../module/define";
import { eventHandler } from "h3";

export default defineModule({
  name: "osmos:rsc",
  setup(app) {
    app.hook("nitro:init", async (nitro) => {
      if (app.options.dev) {
        nitro.options.devHandlers.push({
          route: "/_rsc",
          handler: eventHandler(async (event) => {
            const entry = await __vite_rsc_runner
              .import(fileURLToPath(new URL("./handler.js", import.meta.url)))
              .then((m) => m.default);

            return entry(event);
          }),
        });
      }
    });
  },
});
