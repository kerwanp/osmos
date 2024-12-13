import { PluginOption } from "vite";
import type { Plugin } from "postcss";
import { createJiti } from "jiti";
import invariant from "invariant";

export type PostCSSOptions = {
  plugins: string[];
};

export default function postcss(options: PostCSSOptions): PluginOption {
  return {
    name: "osmos:postcss",
    async config(config) {
      invariant(config.root, "Vite root directory must be defined");

      const jiti = createJiti(config.root);
      const plugins: Plugin[] = [];
      for (const pluginName of options.plugins) {
        const fn = (await jiti.import(pluginName, {
          try: true,
          default: true,
        })) as (opts?: any) => Plugin;
        if (typeof fn === "function") {
          plugins.push(fn());
        }
      }

      return {
        css: {
          postcss: {
            plugins,
          },
        },
      };
    },
  };
}
