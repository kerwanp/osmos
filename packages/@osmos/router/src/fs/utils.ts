import esbuild from "esbuild";
import fs from "fs";
import { parse } from "es-module-lexer";

export function analyzeModule(src: string) {
  return parse(
    esbuild.transformSync(fs.readFileSync(src, "utf-8"), {
      jsx: "transform",
      format: "esm",
      loader: "tsx",
    }).code,
    src,
  );
}

const PATH_RE = new RegExp(/(.*)\/(.*)\.(.*)/);

export function toPath(src: string, cwd: string) {
  const matches = cleanPath(src, cwd).match(PATH_RE);

  if (!matches) return null;

  return {
    source: src,
    path: matches[1].length <= 0 ? "/" : matches[1],
    type: matches[2],
    ext: matches[3],
  };
}

/**
 * Clean file path by removing base path.
 */
export function cleanPath(src: string, cwd: string) {
  return src.slice(cwd.length);
}
