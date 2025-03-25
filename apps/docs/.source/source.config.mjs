// source.config.ts
import { defineCollections } from "fumadocs-mdx/config";
var docs = defineCollections({
  type: "doc",
  dir: "content/docs"
});
export {
  docs
};
