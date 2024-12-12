import { defineCommand } from "citty";
import list from "./list";

export default defineCommand({
  meta: {
    name: "task",
  },
  subCommands: {
    list,
  },
});
