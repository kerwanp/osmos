import { eventHandler, sendRedirect } from "h3";
import { OsmosApp } from "osmos";
import { withoutTrailingSlash, withTrailingSlash } from "ufo";
import { resolveTailwindConfigFile } from "./utils";

export async function setupViewer(osmos: OsmosApp) {
  const configPath = resolveTailwindConfigFile(osmos.options.rootDir);

  if (!configPath) return;

  const route = "/_tailwind";
  const [routeWithSlash, routeWithoutSlash] = [
    withTrailingSlash(route),
    withoutTrailingSlash(route),
  ];

  const viewerServer = await Promise.all([
    import("tailwind-config-viewer/server/index.js").then(
      (r) => r.default || r,
    ),
    import("tailwindcss/loadConfig.js")
      .then((r) => r.default || r)
      .then((loadConfig) => () => loadConfig(configPath)),
  ]).then(([server, tailwindConfigProvider]) =>
    server({
      tailwindConfigProvider,
    }).asMiddleware(),
  );

  const viewerDevMiddleware = eventHandler((event) =>
    viewerServer(event.node?.req || event.req, event.node?.res || event.res),
  );

  osmos.hook("nitro:init", async (nitro) => {
    // We must ensure url has trailing slash for loading assets properly
    nitro.options.devHandlers.unshift(
      {
        handler: eventHandler((event) => {
          console.log(event.path);
          if (event.path === routeWithoutSlash) {
            return sendRedirect(event, routeWithSlash, 301);
          }
        }),
      },
      {
        route: routeWithSlash,
        handler: viewerDevMiddleware,
      },
    );
  });
}
