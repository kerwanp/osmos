import {
  createServerModuleRunner,
  EnvironmentOptions,
  PluginOption,
} from "vite";
import { transformSource } from "react-server-dom-esm/node-loader";
import { ModuleRunner } from "vite/module-runner";

export default function reactServer(): PluginOption {
  return {
    name: "osmos:react-server",
    config() {
      return {
        environments: {
          rsc: environment(),
        },
      };
    },
    async configureServer(server) {
      const env = server.environments["rsc"];
      const runner = createServerModuleRunner(env);

      globalThis.__vite_rsc_runner = runner;
    },
    async transform(code, id) {
      const isRSC = this.environment.name === "rsc";

      if (!isRSC) return;

      const context = {
        format: "module",
        url: `/@fs${id}`,
      };

      const { source } = await transformSource(
        code,
        context,
        (source: string) => ({ source }),
      );

      return source;
    },
  };
}

function environment(): EnvironmentOptions {
  return {
    optimizeDeps: {
      include: [
        "osmos",
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "osmos > react-server-dom-esm/server",
        "osmos > react-server-dom-esm/server.node",
      ],
    },
    resolve: {
      conditions: ["module", "react-server"],
      noExternal: true,
    },
    build: {
      outDir: "dist/react-server",
      sourcemap: true,
      ssr: true,
      emitAssets: true,
      manifest: true,
    },
  };
}

declare global {
  var __vite_rsc_runner: ModuleRunner;
}
