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

    osmos.logger.start(`Configuring module '${args.name}'...`);
    const mod = await import(args.name).then((r) => r.default);

    let fn = mod;

    // TODO: HOTFIX: issue when importing module stubbed with jitti
    if (typeof fn === "object" && "default" in fn) {
      fn = mod.default;
    }

    const module = fn();

    if (module.configure) {
      await module.configure(osmos, osmos.logger.withTag(mod.name));
    }

    osmos.logger.success(`Module '${args.name}' successfully configured`);
  },
});
