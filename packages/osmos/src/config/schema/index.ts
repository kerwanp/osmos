import { defineUntypedSchema } from "untyped";
import app from "./app";
import common from "./common";
import nitro from "./nitro";

export default defineUntypedSchema({
  ...common,
  ...app,
  ...nitro,
});
