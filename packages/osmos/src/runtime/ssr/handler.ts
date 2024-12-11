import { setHeader, eventHandler } from "h3";

import ReactServerDOM from "react-server-dom-esm/client.node";

import { PassThrough } from "stream";
import ReactDOM from "react-dom/server";
import { fileURLToPath } from "mlly";
import { join } from "pathe";

export default eventHandler(async (event) => {
  const { renderer } = await __vite_rsc_runner.import(
    fileURLToPath(new URL("../rsc/renderer.js", import.meta.url)),
  );

  const { pipe } = await renderer(event.path);

  const rscPayload = pipe(new PassThrough());

  // TODO: Use rootDir
  const element = await ReactServerDOM.createFromNodeStream(
    rscPayload,
    process.cwd(),
    process.cwd(),
  );

  const clientEntry = join(
    "/_osmos",
    "@fs",
    fileURLToPath(new URL("../client/entry.js", import.meta.url)),
  );

  const stream = await new Promise(async (resolve) => {
    const stream = ReactDOM.renderToPipeableStream(element, {
      bootstrapScriptContent: `window.__vite_plugin_react_preamble_installed__ = true`,
      bootstrapModules: [clientEntry],
      onShellReady() {
        resolve(stream);
      },
    });
  });

  setHeader(event, "content-type", "text/html");

  return stream;
});
