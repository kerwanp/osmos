import { Route } from "../types";

export function matchRoutes(path: string, routes: Route[]) {
  const output: [Route, Record<string, string>][] = [];
  for (const route of routes) {
    const match = path.match(route.pattern);
    if (!match) continue;

    output.push([route, match.groups ?? {}]);
  }

  return output;
}
