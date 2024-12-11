import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  app: {
    baseURL: {
      $resolve: (val) => val || "/",
    },
  },
});
