import { eventHandler, H3Event, setHeader } from "h3";

import ReactServerDOM from "react-server-dom-esm/client";

import { PassThrough } from "node:stream";
import ReactDOM from "react-dom/server";
import { ServerResponse } from "node:http";

async function importClientReference(id: string) {
  const { default: manifest } = await import("virtual:react-server:manifest");
  return manifest.import(id);
}

// TODO: Memoize ?
globalThis.__import_client_ref = importClientReference;

export default eventHandler(async (event) => {
  // We clone the request to be handled by the react-server handler
  event.node.req.url = `/_server${event.node.req.url}`;
  const proxy = new H3Event(event.node.req, new ServerResponse(event.node.req));
  await __nitro_handler(proxy);
  const rsStream = (proxy.node.res as any)._data;

  const element = await ReactServerDOM.createFromNodeStream(rsStream, "", "");

  // @ts-ignore
  const assets = await import("$osmos/ssr-assets").then((r) => r.default);
  const { default: manifest } = await import("virtual:react-server:assets");

  const stream = await new Promise<ReactDOM.PipeableStream>(
    async (resolve, reject) => {
      const stream = ReactDOM.renderToPipeableStream(element, {
        bootstrapModules: assets.bootstrapModules,
        bootstrapScriptContent: `window.__manifest = ${JSON.stringify(manifest)}`,
        onShellReady() {
          resolve(stream);
        },
        onError(error, info) {
          console.log(error, info);
          reject(error);
        },
      });
    },
  );

  setHeader(event, "content-type", "text/html");

  return stream.pipe(injectToHead(assets.head));
});

function injectToHead(data: string) {
  const marker = "<head>";
  let done = false;

  return new PassThrough({
    transform(chunk, _encoding, callback) {
      if (!done && chunk.includes(marker)) {
        const [pre, post] = splitFirst(chunk, marker);
        done = true;
        callback(null, pre + marker + data + post);
        return;
      }

      callback(null, chunk);
    },
  });
}

/**
 * @see https://github.com/hi-ogawa/js-utils/blob/6439b56a2442415929285634742106c87ba90697/packages/utils/src/lodash.ts#L138
 */
function splitFirst(s: string, sep: string): [string, string] {
  let i = s.indexOf(sep);
  if (i === -1) {
    i = s.length;
  }
  return [s.slice(0, i), s.slice(i + sep.length)];
}
