import { runMain as _runMain } from "citty";
import main from "./commands/main";

export function runMain() {
  return _runMain(main);
}
