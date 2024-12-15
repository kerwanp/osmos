import { jsx } from "react/jsx-runtime";
import { eventHandler, setHeaders } from "h3";
import { renderToPipeableStream } from "react-server-dom-esm/server";
import { createServerRouter } from "@osmosjs/router/server";
import routes from "virtual:osmos:routes";
import { PassThrough } from "node:stream";
export default eventHandler(async (event) => {
  const stream = render(event.path);
  setHeaders(event, {
    "content-type": "text/x-component"
  });
  return stream;
});
export async function render(location) {
  const Router = createServerRouter({
    routes,
    location,
    importer: (route) => route.source.import().then((m) => m.default)
  });
  const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(Router, {}), "");
  const stream = pipe(new PassThrough());
  return stream;
}
