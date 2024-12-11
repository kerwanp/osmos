import type { FC } from "react";
import { LayoutRoute, PageRoute, Route } from "../types";

type Importer = (path: string) => Promise<FC<any>>;

export async function ServerRouter({
  routes,
  location,
  importer,
}: {
  routes: Route[];
  location: string;
  importer: Importer;
}) {
  const layout = routes.find(
    (r) => r.type === "layout" && location.startsWith(r.path),
  ) as LayoutRoute | undefined;

  if (layout) {
    const Layout = await importer(layout.source);

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
    const Page = await importer(page.source);

    return <Page />;
  }

  return <div>404 page not found</div>;
}

export function createServerRouter(
  routes: Route[],
  location: string,
  importer: Importer,
): FC {
  return () => (
    <ServerRouter routes={routes} location={location} importer={importer} />
  );
}
