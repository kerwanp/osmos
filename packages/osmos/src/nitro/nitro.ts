import {
  createNitro as _createNitro,
  createDevServer,
  Nitro,
  NitroConfig,
  NitroDevServer,
} from "nitropack";
import { createServer } from "vite";
import { OsmosApp } from "../core/app";
import { fileURLToPath } from "url";
import { join } from "pathe";

export async function createNitro(osmos: OsmosApp) {
  const config: NitroConfig = {
    framework: {
      name: "osmos",
    },
    dev: osmos.options.dev,
    debug: osmos.options.debug,
    rootDir: osmos.options.rootDir,
    baseURL: osmos.options.app.baseURL,
    workspaceDir: osmos.options.workspaceDir,
    compatibilityDate: "2024-12-07",
    buildDir: osmos.options.buildDir,
    output: {
      dir: osmos.options.buildDir,
      serverDir: join(osmos.options.buildDir, "server"),
      publicDir: join(osmos.options.buildDir, "client"),
    },
    devHandlers: [],
    plugins: [
      fileURLToPath(new URL("./plugins/app-handler.js", import.meta.url)),
    ],
  };

  const nitro = await _createNitro(config);

  await osmos.callHook("nitro:init", nitro);

  return nitro;
}

export async function createNitroDevServer(
  nitro: Nitro,
): Promise<NitroDevServer> {
  const nitroDevServer = createDevServer(nitro);
  await installNitroPlugins(nitro.options.plugins, nitroDevServer);
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
