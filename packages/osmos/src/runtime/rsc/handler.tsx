import { eventHandler, setHeaders } from "h3";
import { renderToPipeableStream } from "react-server-dom-esm/server";
// @ts-expect-error
import routes from "$osmos/routes";
import { createServerRouter } from "../../router/server/router";

export default eventHandler(async (event) => {
  const stream = render(event.path);

  setHeaders(event, {
    "content-type": "text/x-component",
    Router: "rsc",
  });

  return stream;
});

export async function render(location: string) {
  const Router = createServerRouter(routes, location);
  return renderToPipeableStream(<Router />, "");
}
