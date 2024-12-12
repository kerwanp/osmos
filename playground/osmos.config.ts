import { defineConfig } from "osmos/config";

export default defineConfig({
  debug: true,
  routeRules: {
    // "/": { static: true },
  },
  nitro: {
    prerender: {
      routes: ["/", "/users"],
    },
  },
});
