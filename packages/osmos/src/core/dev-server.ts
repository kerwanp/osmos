import { NitroDevServer } from "nitropack";
import { OsmosApp } from "./app";
import { createViteDevServer } from "../vite/main";
import { ViteDevServer } from "vite";
import { createNitroDevServer } from "../nitro/nitro";

export type OsmosDevServer = {
  osmos: OsmosApp;
  server: NitroDevServer;
  vite: ViteDevServer;
  listen: NitroDevServer["listen"];
  close: NitroDevServer["close"];
};

export async function createOsmosDevServer(
  osmos: OsmosApp,
): Promise<OsmosDevServer> {
  const viteDevServer = await createViteDevServer(osmos);
  const nitroDevServer = await createNitroDevServer(osmos.nitro);

  return {
    osmos,
    server: nitroDevServer,
    vite: viteDevServer,
    listen: nitroDevServer.listen,
    close: nitroDevServer.close,
  };
}
