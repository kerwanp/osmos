import { defineCommand } from "citty";
import prepare from "./prepare";
import build from "./build";

export default defineCommand({
  meta: {
    name: "kit",
  },
  subCommands: {
    prepare,
    build,
  },
});
