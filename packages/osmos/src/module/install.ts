import { createJiti } from "jiti";
import { OsmosApp } from "../core/app";
import { ModuleDefinition } from "./types";

export async function installModules(osmos: OsmosApp) {
  const jiti = createJiti(osmos.options.rootDir);

  for (const module of osmos.options.modules) {
    if (typeof module === "string") {
      let fn = (await jiti.import(module, { try: true, default: true })) as any;

      if (!fn) {
        osmos.logger.warn(`Could not import Osmos module '${module}'.`);
        continue;
      }

      // TODO: HOTFIX: Seems there is an issue when jiti loads jiti
      if ("default" in fn) {
        fn = fn.default;
      }

      if (typeof fn !== "function") {
        osmos.logger.warn(`Could not import Osmos module '${module}'.`);
        continue;
      }

      // TODO: We should allow passing parameters
      await installModule(osmos, fn());
    } else {
      await installModule(osmos, module());
    }
  }
}

async function installModule(osmos: OsmosApp, definition: ModuleDefinition) {
  osmos.logger.debug(`Installing module '${definition.name}'`);
  await definition.setup(osmos, osmos.logger.withTag(definition.name));
}
