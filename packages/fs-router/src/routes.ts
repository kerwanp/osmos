import { basename, extname } from "pathe";
import { FilesOptions } from "./types";
import { RadixRouter } from "radix3";
import { pathToPattern } from "./utils/pathToPattern";

export type UpdateFileOptions<T extends FilesOptions> = {
  base: string;
  router: RadixRouter;
  files: T;
};

export function updateFile<T extends FilesOptions>(
  file: string,
  { router, base, files }: UpdateFileOptions<T>,
) {
  const types = Object.keys(files);
  const ext = extname(file);
  const type = basename(file, ext) as keyof T;

  if (!types.includes(type as string)) return;
  if (!files[type].verifier()) return;

  const pattern = pathToPattern(file, {
    base,
    isMiddleware: files[type].isMiddleware,
  });

  router.insert(pattern, {
    type,
    pattern,
    path: file,
    source: file,
  });
}

export function removeFile<T extends FilesOptions>(
  file: string,
  { router, base, files }: UpdateFileOptions<T>,
) {
  const types = Object.keys(files);
  const ext = extname(file);
  const type = basename(file, ext) as keyof T;

  if (!types.includes(type as string)) return;

  const pattern = pathToPattern(file, {
    base,
    isMiddleware: files[type].isMiddleware,
  });

  router.remove(pattern);
}
