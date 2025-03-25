import { PluginOption } from "vite";
import { FileSystemRouter } from "../router";
import { FilesOptions } from "../types";

export type FileSystemRouterVirtualPluginOptions<T extends FilesOptions> = {
  router: FileSystemRouter<T>;
};

export function virtual<T extends FilesOptions>({
  router,
}: FileSystemRouterVirtualPluginOptions<T>): PluginOption {
  const virtualId = "virtual:osmos:routes";
  const $virtualId = `\0${virtualId}`;

  return {
    name: "osmos:fs-router:virtual",
    resolveId(id) {
      if (id === virtualId) {
        return $virtualId;
      }
    },
    async load(id) {
      if (id === $virtualId) {
        const code = JSON.stringify(await router.getRoutes(), (key, value) => {
          if (key !== "source") return value;
          return {
            id: value,
            import: `_$() => import('${value}')$_`,
          };
        })
          .replaceAll('"_$', "")
          .replaceAll('$_"', "");

        return `export default ${code}`;
      }
    },
  };
}
