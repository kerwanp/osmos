import { defineCommand } from "citty";
import dev from "./dev";
import build from "./build";
import task from "./task";
import prepare from "./prepare";
import kit from "./kit";
import configure from "./configure";

export default defineCommand({
  meta: {
    name: "main",
  },
  subCommands: {
    dev,
    build,
    task,
    prepare,
    kit,
    configure,
  },
});
