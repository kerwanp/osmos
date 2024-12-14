import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  devServer: {
    port:
      process.env.OSMOS_PORT ||
      process.env.NITRO_PORT ||
      process.env.PORT ||
      3000,

    host:
      process.env.OSMOS_HOST ||
      process.env.NITRO_HOST ||
      process.env.HOST ||
      undefined,

    https: false,
  },
});
