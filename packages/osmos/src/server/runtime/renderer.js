import { jsx } from "react/jsx-runtime";
import { renderToPipeableStream } from "react-server-dom-esm/server";
import { createServerRouter } from "@osmosjs/router/server";
import routes from "virtual:osmos:routes";
export async function render(location) {
  const Router = createServerRouter({
    routes,
    location,
    importer: (route) => route.source.import().then((m) => m.default)
  });
  return renderToPipeableStream(/* @__PURE__ */ jsx(Router, {}), "");
}
