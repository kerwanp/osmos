import { posix } from "node:path";
import fg from "fast-glob";

export function resolveTailwindConfigFile(dir: string) {
  return fg.sync(
    posix.join(fg.convertPathToPattern(dir), "tailwind.config.{js,mjs,cjs,ts}"),
    { absolute: true },
  )[0];
}
