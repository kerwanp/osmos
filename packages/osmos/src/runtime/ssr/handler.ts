import { setHeader, eventHandler } from "h3";

import ReactServerDOM from "react-server-dom-esm/client";

import { PassThrough } from "stream";
import ReactDOM from "react-dom/server";
import { fileURLToPath } from "mlly";
import { join } from "pathe";

async function importRSC() {
  let mod: typeof import("../rsc/handler");

  if (import.meta.env.DEV) {
    mod = await __vite_rsc_runner.import(
      fileURLToPath(new URL("../rsc/handler.js", import.meta.url)),
    );
  } else {
    // TODO: That's not great
    mod = import(
      fileURLToPath(
        new URL(
          "../../.osmos/dist/react-server/index.js" as string /* @vite-ignore */,
          import.meta.url,
        ),
      )
    ) as any;
  }

  return mod;
}

async function importClientReference(id: string) {
  if (import.meta.env.DEV) {
    return import(/* @vite-ignore */ id);
  } else {
    const clientReferences = await import("$osmos/client-references" as string);
    console.log(clientReferences, id);
    const dynImport = clientReferences.default[id];
    return dynImport();
  }
}

// TODO: Memoize ?
globalThis.__import_client_ref = importClientReference;

export default eventHandler(async (event) => {
  const { render } = await importRSC();

  const { pipe } = await render(event.path);

  const rscPayload = pipe(new PassThrough());

  // TODO: Use rootDir
  const element = await ReactServerDOM.createFromNodeStream(rscPayload, "", "");

  // @ts-ignore
  const assets = await import("$osmos/ssr-assets").then((r) => r.default);

  const stream = await new Promise(async (resolve) => {
    const stream = ReactDOM.renderToPipeableStream(element, {
      bootstrapScriptContent: `window.__vite_plugin_react_preamble_installed__ = true`,
      bootstrapModules: assets.bootstrapModules,
      onShellReady() {
        resolve(stream);
      },
    });
  });

  setHeader(event, "content-type", "text/html");

  return stream;
});
