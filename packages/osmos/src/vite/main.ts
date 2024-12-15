import { createBuilder, createServer, InlineConfig } from "vite";
import { OsmosApp } from "../core/app";
import baseReact from "@vitejs/plugin-react";
import { fileURLToPath } from "mlly";
import { reactSSR } from "./plugins/react/react-ssr";
import { join } from "pathe";
import { reactClient } from "./plugins/react/react-client";
import { serverCss } from "./plugins/react/server-css";
import { nitro } from "./plugins/nitro";
import { fileSystemRouter } from "@osmosjs/router/fs";
import postcss from "./plugins/postcss";
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
        osmosVite(),
        fileSystemRouter({
          dir: osmos.options.appDir,
          extensions: osmos.options.extensions,
          files: ["page", "layout"],
          environmentName: "server",
        }),
        postcss({
          plugins: osmos.options.postcss.plugins,
        }),
        baseReact(),
        nitro(osmos.nitro),
        reactSSR({
          outDir: join(osmos.options.buildDir, "dist", "ssr"),
          entry: fileURLToPath(
            new URL("../ssr/runtime/handler", import.meta.url),
          ),
        }),
        reactClient({
          outDir: join(osmos.options.buildDir, "dist", "client"),
          entry: fileURLToPath(
            new URL("../client/runtime/entry", import.meta.url),
          ),
        }),
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
      environments: {
        ssr: {
          build: {
            outDir: join(osmos.options.buildDir, "dist", "ssr"),
            rollupOptions: {
              input: {
                renderer: fileURLToPath(
                  new URL("../nitro/runtime/renderer", import.meta.url),
                ),
              },
            },
          },
        },
        server: {
          build: {
            outDir: join(osmos.options.buildDir, "dist", "server"),
            rollupOptions: {
              input: {
                handler: fileURLToPath(
                  new URL("../server/runtime/handler", import.meta.url),
                ),
              },
            },
          },
        },
      },
    },
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
