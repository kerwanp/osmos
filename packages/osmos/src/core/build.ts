import { build as buildNitro, copyPublicAssets, prerender } from "nitropack";
import { OsmosApp } from "./app";
import { buildVite } from "../vite/main";

export async function buildOsmos(osmos: OsmosApp) {
  osmos.logger.debug("Building Osmos App");

  await buildVite(osmos);

  await copyPublicAssets(osmos.nitro);

  osmos.nitro.hooks.hook("prerender:init", (nitro) => {
    nitro.options.appConfigFiles = [];
    nitro.logger = osmos.logger;
  });

  await buildNitro(osmos.nitro);
  await prerender(osmos.nitro);
}
