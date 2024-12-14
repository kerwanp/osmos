import { getRandomPort } from "get-port-please";
import { PluginOption } from "vite";

export default function randomPort(): PluginOption {
  return {
    name: "osmos:random-port",
    async config() {
      const port = await getRandomPort();
      return {
        server: {
          hmr: {
            port,
          },
        },
      };
    },
  };
}
