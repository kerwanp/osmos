import { OsmosApp } from "../core/app";
import { ModuleDefinition } from "./types";

export async function installModules(app: OsmosApp) {
  for (const module of app.options.modules as ModuleDefinition[]) {
    app.logger.debug(`Installing module '${module.name}'`);
    await module.setup(app, app.logger.withTag(module.name));
  }
}
