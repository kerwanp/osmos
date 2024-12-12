import { OsmosApp } from "../core/app";
import { ModuleDefinition } from "./types";

export async function installModules(osmos: OsmosApp) {
  for (const module of osmos.options.modules) {
    if (typeof module === "string") {
      const mod = await import(module).then((r) => r.default);
      await installModule(osmos, mod);
    } else {
      await installModule(osmos, module);
    }
  }
}

async function installModule(osmos: OsmosApp, definition: ModuleDefinition) {
  osmos.logger.debug(`Installing module '${definition.name}'`);
  await definition.setup(osmos, osmos.logger.withTag(definition.name));
}
