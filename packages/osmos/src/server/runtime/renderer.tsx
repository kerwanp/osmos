import { renderToPipeableStream } from "react-server-dom-esm/server";
import { createServerRouter } from "@osmosjs/router/server";
import routes from "virtual:osmos:routes";

export async function render(location: string) {
  const Router = createServerRouter({
    routes,
    location,
    importer: (route) =>
      (route as any).source.import().then((m: any) => m.default),
  });

  return renderToPipeableStream(<Router />, "");
}
