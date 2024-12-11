import { createError, eventHandler, fromNodeMiddleware } from "h3";
import defineModule from "../../module/define";
import invariant from "invariant";
import { ViteDevServer } from "vite";
import { join } from "path";

export default defineModule({
  name: "osmos:client",
  setup(app) {
    let viteDev: ViteDevServer;

    app.hook("vite:dev:init", (vite) => {
      viteDev = vite;
    });

    app.hook("nitro:init", async (nitro) => {
      if (app.options.dev) {
        nitro.options.devHandlers.push({
          route: "/_osmos",
          handler: eventHandler(async (event) => {
            invariant(viteDev, "Vite Dev Server is not running");
            const middleware = fromNodeMiddleware(viteDev.middlewares);
            await middleware(event);

            throw createError({
              status: 404,
            });
          }),
        });
      } else {
        console.log(join(nitro.options.buildDir, "dist", "client", "assets"));
        // @ts-expect-error
        nitro.options.publicAssets.push({
          dir: join(nitro.options.buildDir, "dist", "client", "assets"),
          baseURL: "/_osmos/assets",
          fallthrough: false,
        });
      }
    });
  },
});
