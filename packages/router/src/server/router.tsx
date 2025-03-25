import type { FC, ReactNode } from "react";
import type { Router } from "../types";
import { createMatcherFromExport } from "radix3";
import consola from "consola";

type Importer = (type: string, file: any) => Promise<FC<any>>;

export async function ServerRouter({
  routes,
  location,
  importer,
}: {
  routes: Router;
  location: string;
  importer: Importer;
}) {
  const matcher = createMatcherFromExport(routes);
  const matches = matcher.matchAll(location);

  const page = matches[matches.length - 1];
  const layouts = matches.filter((m) => m.type === "layout");

  if (!page || page.type !== "page") {
    consola.error(`404: ${location}`);
    return null;
  }

  async function RenderPage() {
    const Page = await importer("page", page);
    return <Page />;
  }

  async function RenderLayout({ layouts }: { layouts: any[] }) {
    const layout = layouts.shift();
    const Layout = await importer("layout", layout);

    return (
      <Layout>
        {layouts.length ? <RenderLayout layouts={layouts} /> : <RenderPage />}
      </Layout>
    );
  }

  return <RenderLayout layouts={layouts} />;
}

export type CreateServerRouterOptions = {
  routes: Router;
  location: string;
  importer: Importer;
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
