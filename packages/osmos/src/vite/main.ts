import { createBuilder, createServer, InlineConfig } from "vite";
import { OsmosApp } from "../core/app";
import { fileURLToPath } from "mlly";
import { join } from "pathe";
import { serverCss } from "./plugins/react/server-css";
import { nitro } from "./plugins/nitro";
import randomPort from "./plugins/random-port";
import defu from "defu";
import osmosVite from "@osmosjs/vite";

export function createViteConfig(osmos: OsmosApp): InlineConfig {
  return defu(
    {
      configFile: false,
      appType: "custom",
      base: "/_osmos",
      root: osmos.options.rootDir,
      plugins: [
        randomPort(),
        osmosVite({
          outDir: join(osmos.options.buildDir, "dist"),
          appDir: osmos.options.appDir,
          entries: {
            client: fileURLToPath(
              new URL("../client/runtime/entry", import.meta.url),
            ),
            ssr: fileURLToPath(
              new URL("../ssr/runtime/handler", import.meta.url),
            ),
            server: fileURLToPath(
              new URL("../server/runtime/handler", import.meta.url),
            ),
          },
          extensions: osmos.options.extensions,
        }),
        nitro(osmos.nitro),
        serverCss({
          environmentName: "server",
          serverEntry: fileURLToPath(
            new URL("../server/runtime/handler", import.meta.url),
          ),
        }),
      ],
      cacheDir: `${osmos.options.rootDir}/node_modules/.cache/osmos`, // TODO: Use specific cacheDir option
      server: {
        middlewareMode: true,
        fs: {
          allow: [osmos.options.workspaceDir],
        },
      },
    } satisfies InlineConfig,
    osmos.options.vite,
  );
}

export async function createViteDevServer(osmos: OsmosApp) {
  osmos.logger.debug("Creating Vite development server");

  const config = createViteConfig(osmos);
  const server = await createServer(config);

  osmos.callHook("vite:dev:init", server);

  return server;
}

export async function buildVite(osmos: OsmosApp) {
  osmos.logger.debug("Building Vite Application");
  const config = createViteConfig(osmos);
  const builder = await createBuilder(config);

  await builder.build(builder.environments.server);
  await builder.build(builder.environments.client);
  await builder.build(builder.environments.ssr);

  // __vite_rsc_manager.buildStep = "build";
  // await builder.build(builder.environments.rsc);
}
