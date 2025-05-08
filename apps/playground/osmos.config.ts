import { defineConfig } from "@osmosjs/osmos/config";

export default defineConfig({
  debug: true,
  routeRules: {},
  modules: ["@osmosjs/tailwindcss"],
  devServer: {
    port: 3001,
  },
});
