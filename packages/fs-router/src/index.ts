import { FileSystemRouter, FileSystemRouterOptions } from "./router.js";
import { FilesOptions } from "./types.js";

export * from "./routes.js";
export * from "./router.js";

export function createFileSystemRouter<T extends FilesOptions>(
  options: FileSystemRouterOptions<T>,
) {
  return new FileSystemRouter(options);
}
