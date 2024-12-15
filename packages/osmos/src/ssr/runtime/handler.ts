import { setHeader, eventHandler } from "h3";

import ReactServerDOM from "react-server-dom-esm/client";

import { PassThrough } from "node:stream";
import ReactDOM from "react-dom/server";

async function importClientReference(id: string) {
  if (import.meta.env.DEV) {
    return import(/* @vite-ignore */ id);
  } else {
    const clientReferences = await import("$osmos/client-references" as string);
    const dynImport = clientReferences.default[id];
    return dynImport();
  }
}

// TODO: Memoize ?
globalThis.__import_client_ref = importClientReference;

export default eventHandler(async (event) => {
  const RSDE = await import("../../server/runtime/renderer");

  const { pipe } = await RSDE.render(event.path);

  const rscPayload = pipe(new PassThrough());

  // TODO: Use rootDir
  const element = await ReactServerDOM.createFromNodeStream(rscPayload, "", "");

  // @ts-ignore
  const assets = await import("$osmos/ssr-assets").then((r) => r.default);

  const stream = await new Promise<ReactDOM.PipeableStream>(
    async (resolve, reject) => {
      const stream = ReactDOM.renderToPipeableStream(element, {
        bootstrapModules: assets.bootstrapModules,
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
