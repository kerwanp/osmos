import { dirname } from "pathe";

export type PathToPatternOptions = {
  base: string;
  isMiddleware?: boolean;
};

export function pathToPattern(path: string, options: PathToPatternOptions) {
  const directory = dirname(path);
  let pattern = directory
    .slice(options.base.length)
    .replaceAll(/\[(.+?)\]/g, ":$1");

  if (options.isMiddleware) {
    pattern = `${pattern}/**`;
  }

  return pattern;
}
