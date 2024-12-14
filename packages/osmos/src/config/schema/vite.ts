import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  /**
   * Configuration that will be passed directly to Vite.
   *
   * @see [Vite configuration docs](https://vite.dev/config) for more information.
   * Please note that not all vite options are supported in Nuxt.
   * @type {typeof import('vite').InlineConfig}
   */
  vite: {
    root: {
      $resolve: async (val, get) => val ?? (await get("rootDir")),
    },
    mode: {
      $resolve: async (val, get) =>
        (val ?? (await get("dev"))) ? "development" : "production",
    },
  },
});
