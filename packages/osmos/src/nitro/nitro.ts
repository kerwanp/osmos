import {
  createNitro as _createNitro,
  createDevServer,
  NitroConfig,
  NitroDevServer,
} from "nitropack";
import { createServer } from "vite";
import { OsmosApp } from "../core/app";
import defu from "defu";
import { join } from "pathe";
import { fileURLToPath } from "node:url";

export async function createNitro(osmos: OsmosApp) {
  const config: NitroConfig = defu(
    {
      framework: {
        name: "osmos",
      },
      dev: osmos.options.dev,
      debug: osmos.options.debug,
      rootDir: osmos.options.rootDir,
      baseURL: osmos.options.app.baseURL,
      workspaceDir: osmos.options.workspaceDir,
      srcDir: osmos.options.serverDir,
      compatibilityDate: "2024-12-07",
      buildDir: osmos.options.buildDir,
      imports: false,
      scanDirs: [osmos.options.serverDir],
      renderer: join(osmos.options.buildDir, "dist", "ssr", "renderer.js"),
      appConfigFiles: [],
      handlers: [],
      devHandlers: [],
      routeRules: {},
      experimental: {
        tasks: true,
      },
      plugins: [
        fileURLToPath(
          new URL("./runtime/plugins/app-handler", import.meta.url),
        ),
      ],
      typescript: {
        generateTsConfig: true,
      },
      esbuild: {
        options: {
          target: "esnext",
        },
      },
    },
    osmos.options.nitro,
  );

  await osmos.callHook("nitro:config", config);

  const nitro = await _createNitro(config);
  nitro.logger = osmos.logger;

  await osmos.callHook("nitro:init", nitro);

  return nitro;
}

export async function createNitroDevServer(
  osmos: OsmosApp,
): Promise<NitroDevServer> {
  osmos.logger.debug("Creating Nitro development server");
  const nitroDevServer = createDevServer(osmos.nitro);
  await installNitroPlugins(osmos.nitro.options.plugins, nitroDevServer);
  return nitroDevServer;
}

export async function installNitroPlugins(
  plugins: string[],
  dev: NitroDevServer,
) {
  const vite = await createServer({
    configFile: false,
    server: { middlewareMode: true, ws: false },
  });

  // We filter out default nitro plugin that fails to load
  for (const plugin of plugins.filter((p) => !p.endsWith("internal/debug"))) {
    const { default: pluginFn } = await vite.ssrLoadModule(plugin);
    await pluginFn({
      h3App: dev.app,
    });
  }

  await vite.close();
}
