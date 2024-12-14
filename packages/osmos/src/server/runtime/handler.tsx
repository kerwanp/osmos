import { eventHandler, setHeaders } from "h3";
import { renderToPipeableStream } from "react-server-dom-esm/server";
import { createServerRouter } from "@osmos/router/server";
import routes from "virtual:osmos:routes";

export default eventHandler(async (event) => {
  const stream = render(event.path);

  setHeaders(event, {
    "content-type": "text/x-component",
    Router: "rsc",
  });

  return stream;
});

export async function render(location: string) {
  const Router = createServerRouter({
    routes,
    location,
    importer: (route) =>
      (route as any).source.import().then((m: any) => m.default),
  });

  return renderToPipeableStream(<Router />, "");
}
