import type { ConfigSchema } from "../../schema/config";
import type { PartialDeep } from "type-fest";

export interface OsmosConfig extends PartialDeep<ConfigSchema> {}

export interface OsmosOptions extends ConfigSchema {}
