import { globby } from "globby";

export type ScanDirOptions = {
  dir: string;
  files: string[];
  extensions: string[];
};

export function scanDir(options: ScanDirOptions) {
  return globby(".", {
    cwd: options.dir,
    absolute: true,
    expandDirectories: {
      files: options.files,
      extensions: options.extensions,
    },
  });
}
