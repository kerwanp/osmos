import { defineCommand } from "citty";
import prepare from "./prepare";

export default defineCommand({
  meta: {
    name: "kit",
  },
  subCommands: {
    prepare,
  },
});
