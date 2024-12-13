import { defineOsmosModule } from "osmos/module";
import { setupViewer } from "./viewer";

export default defineOsmosModule({
  name: "@osmos/tailwindcss",
  setup(app) {
    app.options.postcss.plugins.push("tailwindcss");
    if (app.options.dev) {
      setupViewer(app);
    }
  },
  configure(app, logger) {},
});
