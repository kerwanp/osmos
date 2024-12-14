import { copyFile, mkdir } from "node:fs/promises";
import { globby } from "globby";
import { dirname, join } from "pathe";

export type CopyOptions = {
  patterns: string | string[];
  target: string;
  src: string;
};

export async function copy(options: CopyOptions) {
  const files = await globby(options.patterns, {
    cwd: options.src,
    dot: true,
  });

  return Promise.all(
    files.map(async (p) => {
      const from = join(options.src, p);
      const to = join(options.target, p);

      await mkdir(dirname(to), { recursive: true });

      return copyFile(from, to);
    }),
  );
}
