import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  app: {
    baseURL: {
      $resolve: (val) => val || "/",
    },
  },

  css: {
    $resolve: (val: string[] | undefined) =>
      (val ?? []).map((c: any) => c.src || c),
  },
});
