import { defineUntypedSchema } from "untyped";
import app from "./app";
import common from "./common";
import nitro from "./nitro";
import postcss from "./postcss";
import dev from "./dev";
import vite from "./vite";

export default defineUntypedSchema({
  ...common,
  ...app,
  ...dev,
  ...nitro,
  ...postcss,
  ...vite,
});
