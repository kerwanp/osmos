import { eventHandler, setHeaders } from "h3";
import { renderToPipeableStream } from "react-server-dom-esm/server";
import { createServerRouter } from "@osmosjs/router/server";
import { PassThrough } from "node:stream";
import routes from "virtual:osmos:routes";

export default eventHandler(async (event) => {
  const stream = render(event.path);

  setHeaders(event, {
    "content-type": "text/x-component",
  });

  return stream;
});

export async function render(location: string) {
  const Router = createServerRouter({
    routes,
    location,
    importer: (type, file) => file.source.import().then((m: any) => m.default),
  });

  // TODO: Use abort
  const { pipe, abort } = renderToPipeableStream(<Router />, "");

  const stream = pipe(new PassThrough());

  return stream;
}
