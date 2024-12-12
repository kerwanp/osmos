import { defineConfig } from "osmos/config";

export default defineConfig({
  debug: true,
  routeRules: {
    "/": { prerender: true, swr: true },
  },
});
