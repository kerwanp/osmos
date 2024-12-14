import { Route } from "../types";

export function matchRoutes(path: string, routes: Route[]) {
  const output: [Route, Record<string, string>][] = [];
  for (const route of routes) {
    const match = path.match(route.pattern);
    if (!match) continue;

    output.push([route, match.groups ?? {}]);
  }

  return output.sort(([a], [b]) => compareRoutes(a, b));
}

export function compareRoutes(a: Route, b: Route): number {
  if (a.path > b.path) {
    return 1;
  }

  if (b.path > a.path) {
    return -1;
  }

  if (a.type === "layout") {
    return -1;
  }

  if (b.type === "layout") {
    return 1;
  }

  return 0;
}
