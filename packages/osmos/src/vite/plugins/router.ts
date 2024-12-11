import { PluginOption } from "vite";
import { FileSystemRouter } from "../../router/file-system/router";

export default function router(router: FileSystemRouter): PluginOption {
  const virtualModuleId = "$osmos/routes";
  const reolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "osmos:router",
    resolveId(id) {
      if (id === "$osmos/routes") {
        return reolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === reolvedVirtualModuleId) {
        const routes = await router.getRoutes();

        let routesCode = JSON.stringify(routes, (key, value) => {
          if (value === undefined) return undefined;

          const buildId = value;
          if (key === "source") {
            return {
              src: value,
              build: `_$() => import(/* @vite-ignore */ '${buildId}')$_`,
              import: `_$() => import(/* @vite-ignore */ '${buildId}')$_`,
            };
          }

          return value;
        });

        routesCode = routesCode.replaceAll('"_$(', "(").replaceAll(')$_"', ")");

        return `export default ${routesCode}`;
      }
    },
  };
}
