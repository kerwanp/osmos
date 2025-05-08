import { defineOsmosModule } from "@osmosjs/osmos/module";
import { ensureDependencyInstalled } from "nypm";
import tailwindcss from "@tailwindcss/vite";

export default defineOsmosModule({
  name: "@osmosjs/tailwindcss",
  setup(app) {
    app.options.vite.plugins = [
      ...(app.options.vite.plugins ?? []),
      tailwindcss(),
    ];
  },
  async configure(app) {
    await ensureDependencyInstalled("tailwindcss", {
      cwd: app.options.rootDir,
      dev: true,
    });
  },
});
