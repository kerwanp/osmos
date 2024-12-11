import { applyDefaults } from "untyped";
import { OsmosConfig, OsmosOptions } from "./types";
import { loadConfig, LoadConfigOptions } from "c12";
import { OsmosConfigSchema } from ".";

export type LoadOsmosConfigOptions = LoadConfigOptions<OsmosConfig>;

export async function loadOsmosConfig(
  options: LoadOsmosConfigOptions,
): Promise<OsmosOptions> {
  const { config } = await loadConfig<OsmosConfig>({
    name: "osmos",
    dotenv: true,
    globalRc: true,
    ...options,
  });

  return (await applyDefaults(
    OsmosConfigSchema,
    config,
  )) as unknown as OsmosOptions;
}
