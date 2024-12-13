import type { FC } from "react";
import type { LayoutRoute, PageRoute, Route } from "../types";

export async function importRoute(route: Route) {
  return (route.source as any).import().then((r: any) => r.default);
}

export async function ServerRouter({
  routes,
  location,
  importer,
}: {
  routes: Route[];
  location: string;
  importer: (route: Route) => Promise<FC<any>>;
}) {
  const layout = routes.find(
    (r) => r.type === "layout" && location.startsWith(r.path),
  ) as LayoutRoute | undefined;

  if (layout) {
    const Layout = await importer(layout);

    return (
      <Layout>
        <ServerRouter
          routes={layout.children}
          location={location}
          importer={importer}
        />
      </Layout>
    );
  }

  const page = routes.find((r) => r.type === "page" && r.path === location) as
    | PageRoute
    | undefined;
  if (page) {
    const Page = await importer(page);

    return <Page />;
  }

  return <div>404 page not found</div>;
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
