import { defineOsmosModule } from "osmos/module";
import { setupViewer } from "./viewer";

export default defineOsmosModule({
  name: "@osmos/tailwindcss",
  setup(app) {
    console.log("HELLO WORLD");

    console.log(app.options.dev);

    if (app.options.dev) {
      setupViewer(app);
    }
  },
  configure(app, logger) {},
});
