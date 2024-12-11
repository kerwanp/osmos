import { renderToPipeableStream } from "react-server-dom-esm/server";
import { createServerRouter } from "../../router/server/router";
// @ts-expect-error
import routes from "$osmos/routes";

export async function renderer(location: string) {
  const Router = createServerRouter(routes, location, (url) =>
    __vite_rsc_runner.import(url).then((m) => m.default),
  );

  return renderToPipeableStream(<Router />, "");
}
