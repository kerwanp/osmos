import type { FC } from "react";
import type { Route } from "../types";
import { matchRoutes } from "../utils/routes";

type RouteWithMatches = ReturnType<typeof matchRoutes>;
type Importer = (route: Route) => Promise<FC<any>>;

export async function importRoute(route: Route) {
  return (route.source as any).import().then((r: any) => r.default);
}

function isRootLayout(route: Route) {
  return route.type === "layout" && route.path === "/";
}

async function Renderer({
  routes,
  importer,
}: {
  routes: RouteWithMatches;
  importer: Importer;
}) {
  const [next, params] = routes.splice(0, 1)[0];

  const PageOrLayout = await importer(next);
  if (next.type === "layout") {
    return (
      <PageOrLayout params={params}>
        <Renderer routes={routes} importer={importer} />
      </PageOrLayout>
    );
  }

  return <PageOrLayout params={params} />;
}

export async function ServerRouter({
  routes,
  location,
  importer,
}: {
  routes: Route[];
  location: string;
  importer: Importer;
}) {
  const matches = matchRoutes(location, routes);

  // If last item is not a page, it is a 404
  // TODO: Later we want to handle custom error pages
  if (matches[matches.length - 1][0]?.type !== "page") {
    return <div>404 Not found</div>;
  }

  const rootLayout = matches.splice(0, 1)[0];
  if (!rootLayout || !isRootLayout(rootLayout[0])) {
    throw new Error("No root layout found");
  }

  const RootLayout = await importer(rootLayout[0]);

  return (
    <RootLayout params={rootLayout[1]}>
      <Renderer routes={matches} importer={importer} />
    </RootLayout>
  );
}

export type CreateServerRouterOptions = {
  routes: Route[];
  location: string;
  importer: (route: Route) => Promise<FC<any>>;
};

export function createServerRouter(options: CreateServerRouterOptions): FC {
  return () => (
    <ServerRouter
      routes={options.routes}
      location={options.location}
      importer={options.importer}
    />
  );
}
