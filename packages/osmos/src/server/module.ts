import { eventHandler } from "h3";
import { join } from "pathe";
import { defineOsmosModule } from "../module";
import { fileURLToPath } from "url";

export default defineOsmosModule({
  name: "osmos:server",
  setup(app) {
    if (app.options.dev) {
      app.hook("nitro:init", async (nitro) => {
        nitro.options.devHandlers.push({
          route: "/_server",
          handler: eventHandler(async (event) => {
            const entry = await __vite_rsc_runner
              .import(
                fileURLToPath(new URL("./runtime/handler", import.meta.url)),
              )
              .then((m) => m.default);

            return entry(event);
          }),
        });
      });
    } else {
      app.hook("nitro:init", async (nitro) => {
        nitro.options.handlers.push({
          route: "/_server",
          handler: join(nitro.options.buildDir, "dist", "server", "handler.js"),
          middleware: true,
          lazy: true,
        });
      });
    }
  },
});
