import { Plugin } from "vite";
import { extname, resolve } from "pathe";
import { parseFilename } from "ufo";
import mdxLoader from "fumadocs-mdx/loader-mdx";

export function vitePlugin(): Plugin {
  return {
    name: "osmos:fumadocs",
    async transform(src, id) {
      if (!id.includes(".mdx")) return;

      const filename = parseFilename(id, { strict: true });
      const ext = extname(filename);
      if (ext !== ".mdx") return;

      const configPath = resolve("source.config.ts");

      const result = await new Promise<string>(async (res, rej) => {
        mdxLoader.call(
          {
            context: resolve("./"),
            async: () => {
              return (err: any, file: string) => {
                if (err) rej(err);
                else res(file);
              };
            },
            cacheable: () => {},
            getOptions: () => ({
              _ctx: {
                configPath,
              },
            }),
            resourceQuery: src,
            resourcePath: src,
          },
          src,
        );
      });

      return result;
    },
  };
}
