import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  /**
   * Configuration for Nitro.
   * @see [Nitro configuration docs](https://nitro.unjs.io/config/)
   * @type {typeof import('nitropack/types')['NitroConfig']}
   */
  nitro: {
    routeRules: {
      $resolve: async (val: Record<string, any> | undefined, get) => ({
        ...((await get("routeRules")) as Record<string, any>),
        ...val,
      }),
    },
  },

  /**
   * Global route options applied to matching server routes.
   * @experimental This is an experimental feature and API may change in the future.
   * @see [Nitro route rules documentation](https://nitro.unjs.io/config/#routerules)
   * @type {typeof import('nitropack/types')['NitroConfig']['routeRules']}
   */
  routeRules: {},
});
