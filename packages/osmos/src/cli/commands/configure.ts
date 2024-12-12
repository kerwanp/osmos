import { defineCommand } from "citty";
import { ModuleDefinition } from "../../module";
import { createOsmos } from "../../core/app";
import { loadOsmosConfig } from "../../config/loader";
import { cwdArgs } from "./_shared";
import { resolve } from "pathe";

export default defineCommand({
  meta: {
    name: "configure",
    description: "Run module configuration step",
  },
  args: {
    ...cwdArgs,
    name: {
      type: "positional",
      required: true,
    },
  },
  async run({ args }) {
    const options = await loadOsmosConfig({ cwd: resolve(args.cwd) });
    const osmos = await createOsmos(options);

    osmos.logger.info(`Configuring module '${args.name}'`);
    const mod = (await import(args.name).then(
      (r) => r.default,
    )) as ModuleDefinition;

    if (mod.configure) {
      await mod.configure(osmos, osmos.logger.withTag(mod.name));
    }

    osmos.logger.success(`Module '${args.name}' successfully configured`);
  },
});
