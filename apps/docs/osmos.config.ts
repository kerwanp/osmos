import { defineConfig } from "@osmosjs/osmos/config";
import mdx from "@mdx-js/rollup";

export default defineConfig({
  debug: false,
  routeRules: {},
  modules: ["@osmosjs/tailwindcss"],
  devServer: {
    port: 3000,
  },
  vite: {
    plugins: [mdx()],
  },
});
