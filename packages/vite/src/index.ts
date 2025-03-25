import { PluginOption } from "vite";
import reactServer from "./plugins/react-server";
import reactClient from "./plugins/react-client";
import routerPlugin from "@osmosjs/router/vite";
import reactSSR from "./plugins/react-ssr";
import react from "@vitejs/plugin-react";
import { join } from "pathe";

export type OsmosPluginOptions = {
  outDir: string;
  appDir: string;

  entries: {
    client: string;
    ssr: string;
    server: string;
  };

  extensions: string[];
};

export default function osmos(options: OsmosPluginOptions): PluginOption {
  return [
    react(),
    reactServer({
      outDir: join(options.outDir, "server"),
      entry: options.entries.server,
    }),
    reactClient({
      outDir: join(options.outDir, "client"),
      entry: options.entries.client,
    }),
    reactSSR({
      outDir: join(options.outDir, "ssr"),
      entry: options.entries.ssr,
    }),
    routerPlugin({
      dir: options.appDir,
      environmentName: "server",
      extensions: options.extensions,
    }),
  ];
}
