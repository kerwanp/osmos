import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  postcss: {
    plugins: {
      $resolve: (val: string[] | undefined) => ["autoprefixer", ...(val ?? [])],
    },
  },
});
