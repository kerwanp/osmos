import esbuild from "esbuild";
import fs from "fs";
import { parse } from "es-module-lexer";
import { Route } from "../types";
import { globby } from "globby";

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

  const { regex, power } = pathToRegexp(path, type === "layout");

  return {
    source: src,
    pattern: regex,
    power,
    path,
    type,
  };
}

const SEGMENTS_REGEX = [
  {
    regex: /\[(.+)\]/,
    replace: "(?<$1>.+)",
    power: 0.9,
  },
];

export function segmentToRegexp(segment: string) {
  for (const regexp of SEGMENTS_REGEX) {
    const match = segment.match(regexp.regex);
    if (!match) continue;

    return {
      regex: segment.replace(regexp.regex, regexp.replace),
      power: regexp.power,
    };
  }

  return {
    regex: segment,
    power: 1,
  };
}

export function pathToRegexp(
  path: string,
  middleware: boolean,
): { regex: string; power: number } {
  let pattern = `^${path}`;

  let power = 100;
  const segments: string[] = [];

  for (const segment of pattern.split("/")) {
    const res = segmentToRegexp(segment);
    segments.push(res.regex);

    power *= res.power;
  }

  pattern = segments.join("/");

  if (!middleware) {
    pattern += "$";
  }

  return {
    regex: new RegExp(pattern).source,
    power,
  };
}

/**
 * Clean file path by removing base path.
 */
export function cleanPath(src: string, cwd: string) {
  return src.slice(cwd.length);
}

type ScanDirOptions = {
  dir: string;
  extensions: string[];
  files: string[];
};

export function scanDir(options: ScanDirOptions) {
  return globby(".", {
    cwd: options.dir,
    absolute: true,
    expandDirectories: {
      files: options.files,
      extensions: options.extensions,
    },
  });
}

type PathToRouteOptions = {
  src: string;
  dir: string;
};

export function pathToRoute(options: PathToRouteOptions) {
  const matches = cleanPath(options.src, options.dir).match(PATH_RE);

  if (!matches) return null;

  const path = matches[1].length <= 0 ? "/" : matches[1];
  const type = matches[2];

  return {
    src: options.src,
    path,
    type,
  };
}
