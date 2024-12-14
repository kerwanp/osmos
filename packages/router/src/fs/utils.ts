import esbuild from "esbuild";
import fs from "fs";
import { parse } from "es-module-lexer";
import { Route } from "../types";

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

export function toRoute(
  src: string,
  cwd: string,
  types: string[],
): Route | null {
  const matches = cleanPath(src, cwd).match(PATH_RE);

  if (!matches) return null;

  const path = matches[1].length <= 0 ? "/" : matches[1];
  const type = matches[2];

  if (!types.includes(type)) return null;

  return {
    source: src,
    pattern: pathToRegexp(path, type === "layout"),
    path,
    type,
  };
}

export function pathToRegexp(path: string, middleware: boolean): string {
  let pattern = `^${path}`;

  pattern = pattern
    .split("/")
    // /users/[id] => /users/(?<id>.+)
    .map((segment) => segment.replace(/\[(.+)\]/, "(?<$1>.+)"))
    .join("/");

  if (!middleware) {
    pattern += "$";
  }

  return new RegExp(pattern).source;
}

/**
 * Clean file path by removing base path.
 */
export function cleanPath(src: string, cwd: string) {
  return src.slice(cwd.length);
}
