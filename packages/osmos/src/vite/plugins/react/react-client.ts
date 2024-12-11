import { PluginOption } from "vite";

export type ReactClientOptions = {
  outDir: string;
  entry: string;
};

export function reactClient(options: ReactClientOptions): PluginOption {
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
            ],
          },
          build: {
            outDir: options.outDir,
            manifest: true,
            rollupOptions: {
              input: {
                index: options.entry,
              },
            },
          },
        },
      };
    },
  };
}
