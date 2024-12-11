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
        return `export default ${JSON.stringify(routes)}`;
      }
    },
  };
}
