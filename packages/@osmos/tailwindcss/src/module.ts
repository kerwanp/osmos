import { defineOsmosModule } from "osmos/module";
import { setupViewer } from "./viewer";
import { ensureDependencyInstalled } from "nypm";

export default defineOsmosModule({
  name: "@osmos/tailwindcss",
  setup(app) {
    app.options.postcss.plugins.push("tailwindcss");
    if (app.options.dev) {
      setupViewer(app);
    }
  },
  async configure(app) {
    const test = await ensureDependencyInstalled("tailwindcss", {
      cwd: app.options.rootDir,
      dev: true,
    });

    console.log(test);
  },
});
