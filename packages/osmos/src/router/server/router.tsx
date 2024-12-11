import type { FC } from "react";
import { LayoutRoute, PageRoute, Route } from "../types";

export async function importRoute(route: Route) {
  return (route.source as any).import().then((r: any) => r.default);
}

export async function ServerRouter({
  routes,
  location,
}: {
  routes: Route[];
  location: string;
}) {
  const layout = routes.find(
    (r) => r.type === "layout" && location.startsWith(r.path),
  ) as LayoutRoute | undefined;

  if (layout) {
    const Layout = await importRoute(layout);

    return (
      <Layout>
        <ServerRouter routes={layout.children} location={location} />
      </Layout>
    );
  }

  const page = routes.find((r) => r.type === "page" && r.path === location) as
    | PageRoute
    | undefined;
  if (page) {
    const Page = await importRoute(page);

    return <Page />;
  }

  return <div>404 page not found</div>;
}

export function createServerRouter(routes: Route[], location: string): FC {
  return () => <ServerRouter routes={routes} location={location} />;
}
