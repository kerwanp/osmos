import { PluginOption } from "vite";

export type ReactClientOptions = {
  outDir: string;
  entry: string;
};

export default function reactClient(options: ReactClientOptions): PluginOption {
  const entryId = "$osmos/client/entry";
  const entryResolvedId = `\0${entryId}`;

  return {
    name: "osmos:react-client",
    config(config) {
      config.environments = {
        ...config.environments,
        client: {
          optimizeDeps: {
            include: [
              "react",
              "react/jsx-runtime",
              "react/jsx-dev-runtime",
              "react-dom",
              "react-dom/client",
              "react-server-dom-esm/client",
            ],
          },
          build: {
            outDir: options.outDir,
            manifest: true,
            rollupOptions: {
              input: [options.entry],
            },
          },
        },
      };
    },
    resolveId(id) {
      if (id === entryId) {
        return entryResolvedId;
      }
    },
    async load(id) {
      if (id === entryResolvedId && this.environment.name === "client") {
        return `
          import "virtual:server-css"
          for (let i = 0; !window.__vite_plugin_react_preamble_installed__; i++) {
            await new Promise(resolve => setTimeout(resolve, 10 * (2 ** i)));
          }
          import("${options.entry}");
        `;
      }
    },
  };
}
