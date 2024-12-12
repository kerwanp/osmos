import { Nitro } from "nitropack";
import { PluginOption } from "vite";

export function nitro(nitro: Nitro): PluginOption {
  const virtualId = "$osmos/nitro";
  const $virtualId = `\0${virtualId}`;

  return {
    name: "osmos:nitro",
    resolveId(id) {
      if (id === virtualId) {
        return $virtualId;
      }
    },
    load(id) {
      if (id === $virtualId) {
        const value = {
          serverDir: nitro.options.output.serverDir,
          buildDir: nitro.options.buildDir,
        };

        return `export default ${JSON.stringify(value)}`;
      }
    },
  };
}
