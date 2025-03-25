import { defineConfig } from "@osmosjs/osmos/config";

export default defineConfig({
  debug: false,
  routeRules: {},
  modules: ["@osmosjs/tailwindcss", "@osmosjs/fumadocs"],
  devServer: {
    port: 3000,
  },
});
