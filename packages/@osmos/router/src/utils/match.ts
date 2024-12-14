import matchit from "@poppinss/matchit";
import { Route } from "../types";

export function parse(pattern: string) {
  return pattern.replaceAll(/\[(.+?)\]/g, "(?$1.+)");
}

export function tokenize(pattern: string) {
  return matchit.parse(pattern);
}

export function match(path: string, route: Route) {}

export function cleanPath(src: string, cwd: string) {
  return src.slice(cwd.length);
}
