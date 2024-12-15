import { readFile } from "node:fs/promises";
import { join } from "pathe";
import {
  createServerModuleRunner,
  EnvironmentOptions,
  Manifest,
  PluginOption,
  ViteDevServer,
} from "vite";
import { ModuleRunner } from "vite/module-runner";

export type ReactSSROptions = {
  entry: string;
  outDir: string;
};

export function reactSSR(options: ReactSSROptions): PluginOption {
  const assetsId = "$osmos/ssr-assets";
  const $assetsId = `\0${assetsId}`;

  let viteDevServer: ViteDevServer;
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
      viteDevServer = server;
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
          const config = this.environment.getTopLevelConfig();
          const clientManifest: Manifest = await readFile(
            join(
              config.environments.client.build.outDir,
              ".vite",
              "manifest.json",
            ),
          ).then((r) => JSON.parse(r.toString()));

          // const { head } = await getIndexHtmlTransform(viteDevServer);
          const entry = Object.values(clientManifest).find((r) => r.isEntry);

          const ssrAssets = {
            head: "",
            bootstrapModules: [`/_osmos/${entry?.file}`],
          };

          return `export default ${JSON.stringify(ssrAssets)}`;
        } else {
          const { head } = await getIndexHtmlTransform(viteDevServer);
          const ssrAssets = {
            head,
            bootstrapModules: [`/_osmos/@id/__x00__$osmos/client/entry`],
          };

          return `export default ${JSON.stringify(ssrAssets)}`;
        }
      }
    },
  };
}

function environment(options: ReactSSROptions): EnvironmentOptions {
  return {
    optimizeDeps: {
      include: ["react-server-dom-esm/client"],
      esbuildOptions: {
        target: "esnext",
      },
    },
    build: {
      manifest: true,
      outDir: options.outDir,
      target: "esnext",
      rollupOptions: {
        input: {
          index: options.entry,
        },
      },
    },
  };
}

async function getIndexHtmlTransform(server: ViteDevServer) {
  const html = await server.transformIndexHtml(
    "/",
    "<html><head></head></html>",
  );
  const match = html.match(/<head>(.*)<\/head>/s)!;
  const head = match[1];
  return { head };
}

declare global {
  var __vite_ssr_runner: ModuleRunner;
}
