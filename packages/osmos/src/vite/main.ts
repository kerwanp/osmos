import { createServer } from "vite";
import react from "./plugins/react";
import { OsmosApp } from "../core/app";
import baseReact from "@vitejs/plugin-react";
import router from "./plugins/router";

export async function createViteDevServer(osmos: OsmosApp) {
  osmos.logger.debug("Creating Vite development server");

  const server = await createServer({
    configFile: false,
    appType: "custom",
    base: "/_osmos",
    root: process.cwd(),
    plugins: [baseReact(), react(), router(osmos.router)],
    cacheDir: `${osmos.options.rootDir}/node_modules/.cache/osmos`, // TODO: Use specific cacheDir option
    server: {
      middlewareMode: true,
      fs: {
        allow: [osmos.options.workspaceDir],
      },
    },
  });

  osmos.callHook("vite:dev:init", server);

  return server;
}
