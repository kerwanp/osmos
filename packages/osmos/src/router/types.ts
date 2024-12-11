export type Route = LayoutRoute | PageRoute;

export type LayoutRoute = {
  path: string;
  type: "layout";
  children: Route[];
  source: string;
};

export type PageRoute = {
  path: string;
  type: "page";
  source: string;
};

export type RouteType = Route["type"];
