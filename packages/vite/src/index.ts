import { PluginOption } from "vite";
import reactServer from "./plugins/react-server";

export type OsmosPluginOptions = {};

export default function osmos(): PluginOption {
  return [
    reactServer({
      environmentName: "server",
    }),
  ];
}
