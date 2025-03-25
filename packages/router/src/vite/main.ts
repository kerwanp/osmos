import fsRouter, {
  FileSystemRouterPluginOptions,
} from "@osmosjs/fs-router/vite";
import { FilesOptions } from "@osmosjs/fs-router/types";
import { PluginOption } from "vite";

export const files = {
  page: {
    verifier() {
      return true;
    },
  },
  layout: {
    verifier() {
      return true;
    },
    isMiddleware: true,
  },
} satisfies FilesOptions;

export type RoutePluginOptions = Omit<
  FileSystemRouterPluginOptions<typeof files>,
  "files"
>;

export default function routerPlugin(
  options: RoutePluginOptions,
): PluginOption {
  return [
    fsRouter({
      ...options,
      files,
    }),
  ];
}
