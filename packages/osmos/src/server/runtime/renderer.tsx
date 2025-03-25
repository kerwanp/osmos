import { renderToPipeableStream } from "react-server-dom-esm/server";
import { createServerRouter } from "@osmosjs/router/server";
import router from "virtual:osmos:routes";

export async function render(location: string) {
  const Router = createServerRouter({
    router,
    location,
    importer: (route) =>
      (route as any).source.import().then((m: any) => m.default),
  });

  return renderToPipeableStream(<Router />, "");
}
