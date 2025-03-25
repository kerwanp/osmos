import { defineOsmosModule } from "@osmosjs/osmos/module";
import { vitePlugin } from "./vite";

export default defineOsmosModule({
  name: "@osmosjs/fumadocs",
  setup(app) {
    app.options.vite.plugins = [
      ...(app.options.vite.plugins ?? []),
      vitePlugin(),
    ];

    app.options.vite.resolve = {
      ...app.options.vite.resolve,
      alias: {
        ...app.options.vite.resolve?.alias,
        "next/link": "@osmosjs/osmos/link",
        "next/image": "@osmosjs/osmos/link",
        "next/navigation": "@osmosjs/osmos/navigation",
        "next/dynamic": "@osmosjs/osmos/dynamic",
      },
    };
  },
  async configure(app) {},
});
