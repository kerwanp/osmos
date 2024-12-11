import {
  createServerModuleRunner,
  EnvironmentOptions,
  PluginOption,
} from "vite";
import { ModuleRunner } from "vite/module-runner";

export function reactSSR(): PluginOption {
  return {
    name: "osmos:react-ssr",
    config() {
      return {
        environments: {
          ssr: environment(),
        },
      };
    },
    async configureServer(server) {
      const runner = createServerModuleRunner(server.environments.ssr);
      globalThis.__vite_ssr_runner = runner;
    },
  };
}

function environment(): EnvironmentOptions {
  return {};
}

declare global {
  var __vite_ssr_runner: ModuleRunner;
}
