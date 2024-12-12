import {
  prepare as prepareNitro,
  writeTypes as writeNitroTypes,
} from "nitropack";
import { OsmosApp } from "./app";

export async function prepareOsmos(osmos: OsmosApp) {
  await writeNitroTypes(osmos.nitro);
  await prepareNitro(osmos.nitro);
}
