import { defineConfig } from "osmos/config";

export default defineConfig({
  debug: false,
  routeRules: {},
  modules: ["@osmos/tailwindcss"],
  devServer: {
    port: 3001,
  },
});
