import { PluginOption } from "vite";
import { FileSystemRouterOptions } from "../router";
import { createFileSystemRouter } from "..";
import { hmr } from "./hmr";
import { virtual } from "./virtual";
import { FilesOptions } from "../types";

export type FileSystemRouterPluginOptions<T extends FilesOptions> =
  FileSystemRouterOptions<T> & {
    environmentName: string;
  };

export default function fileSystemRouterPlugin<T extends FilesOptions>({
  environmentName,
  ...options
}: FileSystemRouterPluginOptions<T>): PluginOption {
  const router = createFileSystemRouter(options);

  return [hmr({ router, environmentName }), virtual({ router })];
}
