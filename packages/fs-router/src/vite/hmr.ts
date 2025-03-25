import { PluginOption } from "vite";
import { FileSystemRouter } from "../router";
import { FilesOptions } from "../types";

export type FileSystemRouterHmrPluginOptions<T extends FilesOptions> = {
  router: FileSystemRouter<T>;
  environmentName: string;
};

export function hmr<T extends FilesOptions>({
  router,
  environmentName,
}: FileSystemRouterHmrPluginOptions<T>): PluginOption {
  return {
    name: "osmos:fs-router:hmr",
    configureServer(env) {
      const clientEnvironment = env.environments.client;
      const serverEnvironment = env.environments[environmentName];

      router.hook("reload", () => {
        const mod = serverEnvironment.moduleGraph.getModuleById(
          "\0virtual:osmos:routes",
        );

        if (mod) {
          // serverEnvironment.moduleGraph.invalidateModule(
          //   mod,
          //   undefined,
          //   undefined,
          //   true,
          // );
          // clientEnvironment.hot.send({ type: 'custom' });
        }
      });
    },
    hotUpdate(options) {
      if (this.environment.name !== "server") return;

      if (options.type === "create" && router.addFile(options.file)) {
        return [];
      }

      if (options.type === "delete" && router.removeFile(options.file)) {
        return [];
      }

      if (options.type === "update" && router.updateFile(options.file)) {
        return;
      }

      return;
    },
  };
}
