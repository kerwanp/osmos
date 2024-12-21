/// <reference path="../virtual.d.ts" />

import { PluginOption } from "vite";
import { createFileSystemRouter, FileSystemRouter } from "./router";

export type FileSystemRouterOptions = {
  dir: string;
  files: string[];
  extensions: string[];
  environmentName: string;
};

export function fileSystemRouter(
  options: FileSystemRouterOptions,
): PluginOption {
  const router = createFileSystemRouter({
    dir: options.dir,
    extensions: options.extensions,
  });

  return [
    hmr({ router, environmentName: options.environmentName }),
    virtual(router),
  ];
}

export type FileSystemRouterHmrPluginOptions = {
  router: FileSystemRouter;
  environmentName: string;
};

function hmr({
  router,
  environmentName,
}: FileSystemRouterHmrPluginOptions): PluginOption {
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

      if (options.type === "create" && router.addRoute(options.file)) {
        return [];
      }

      if (options.type === "delete" && router.removeRoute(options.file)) {
        return [];
      }

      if (options.type === "update" && router.updateRoute(options.file)) {
        return;
      }

      return;
    },
  };
}

function virtual(router: FileSystemRouter): PluginOption {
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
