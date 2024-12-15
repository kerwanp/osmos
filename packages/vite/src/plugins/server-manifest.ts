import { PluginOption } from "vite";
import { $global } from "../global";

export default function serverManifest(): PluginOption {
  const virtualId = "virtual:react-server:manifest";
  const $virtualId = `\0${virtualId}`;

  return {
    name: "osmos:server:manifest",
    resolveId(id) {
      if (id === virtualId) {
        return $virtualId;
      }
    },
    load(id) {
      if (id === $virtualId) {
        return [
          `export default {`,
          ...[...$global.clientReferences.entries()].map(
            ([id, { hash, fileName }]) =>
              `'${hash}': { import: () => import('${id}'), clientAsset: '${fileName}' },`,
          ),
          "}",
        ].join("\n");
      }
    },
  };
}