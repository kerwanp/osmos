import { defineCommand } from "citty";
import dev from "./dev";

export default defineCommand({
  meta: {
    name: "main",
  },
  subCommands: {
    dev,
  },
});
