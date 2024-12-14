import { defineConfig } from "osmos/config";
import mdx from "@mdx-js/rollup";

export default defineConfig({
  debug: false,
  routeRules: {},
  modules: ["@osmos/tailwindcss"],
  devServer: {
    port: 3000,
  },
  vite: {
    plugins: [mdx()],
  },
});
