import { fileURLToPath } from "url";
import { scanDir } from "../../src/router/file-system/router";
import { fixturesUrl } from "../fixtures/main";

it("scanDir should identify all pages and layouts", async () => {
  const result = await scanDir(new URL("./src/app", fixturesUrl), [
    "ts",
    "tsx",
  ]);

  console.log(fileURLToPath(new URL("./src/app", fixturesUrl)));

  console.log(result);
});
