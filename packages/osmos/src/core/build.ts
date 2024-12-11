import {
  build as buildNitro,
  copyPublicAssets,
  prepare as prepareNitro,
} from "nitropack";
import { OsmosApp } from "./app";
import { buildVite } from "../vite/main";

export async function buildOsmos(osmos: OsmosApp) {
  await prepareNitro(osmos.nitro);

  await buildVite(osmos);

  await copyPublicAssets(osmos.nitro);
  await buildNitro(osmos.nitro);
}
