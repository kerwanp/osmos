import { readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import {
  createServerModuleRunner,
  EnvironmentOptions,
  Manifest,
  PluginOption,
} from "vite";
import { ModuleRunner } from "vite/module-runner";

export type ReactSSROptions = {
  entry: string;
  outDir: string;
};

export function reactSSR(options: ReactSSROptions): PluginOption {
  const assetsId = "$osmos/ssr-assets";
  const $assetsId = `\0${assetsId}`;

  return {
    name: "osmos:react-ssr",
    config() {
      return {
        environments: {
          ssr: environment(options),
        },
      };
    },
    async configureServer(server) {
      const runner = createServerModuleRunner(server.environments.ssr);
      globalThis.__vite_ssr_runner = runner;
    },
    resolveId(id) {
      if (id === assetsId) {
        return $assetsId;
      }
    },
    async load(id) {
      if (id === $assetsId) {
        if (this.environment.mode === "build") {
          const content: Manifest = await readFile(
            join(options.outDir, "../", "client", ".vite", "manifest.json"),
          ).then((r) => JSON.parse(r.toString()));

          const entry = Object.values(content).find((r) => r.isEntry);

          const ssrAssets = {
            bootstrapModules: [`/_osmos/${entry?.file}`],
          };

          return `export default ${JSON.stringify(ssrAssets)}`;
        }
      }
    },
  };
}

function environment(options: ReactSSROptions): EnvironmentOptions {
  return {
    build: {
      manifest: true,
      outDir: options.outDir,
      rollupOptions: {
        input: {
          index: options.entry,
        },
      },
    },
  };
}

declare global {
  var __vite_ssr_runner: ModuleRunner;
}
