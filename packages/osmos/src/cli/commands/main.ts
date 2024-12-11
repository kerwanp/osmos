import { defineCommand } from "citty";
import dev from "./dev";
import build from "./build";

export default defineCommand({
  meta: {
    name: "main",
  },
  subCommands: {
    dev,
    build,
  },
});
