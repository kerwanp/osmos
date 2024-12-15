import { eventHandler, H3Event, setHeader } from "h3";
import ReactServerDOM from "react-server-dom-esm/client";
import { PassThrough } from "node:stream";
import ReactDOM from "react-dom/server";
import { ServerResponse } from "node:http";
async function importClientReference(id) {
  const { default: manifest } = await import("virtual:react-server:manifest");
  const imp = manifest[id];
  if (!imp) {
    throw new Error(`Cannot find reference ${id} in the client manifest`);
  }
  return imp.import();
}
globalThis.__import_client_ref = importClientReference;
export default eventHandler(async (event) => {
  event.node.req.url = `/_server${event.node.req.url}`;
  const proxy = new H3Event(event.node.req, new ServerResponse(event.node.req));
  await __nitro_handler(proxy);
  const rsStream = proxy.node.res._data;
  const element = await ReactServerDOM.createFromNodeStream(rsStream, "", "");
  const assets = await import("$osmos/ssr-assets").then((r) => r.default);
  const { default: manifest } = await import("virtual:react-server:assets");
  const stream = await new Promise(
    async (resolve, reject) => {
      const stream2 = ReactDOM.renderToPipeableStream(element, {
        bootstrapModules: assets.bootstrapModules,
        bootstrapScriptContent: `window.__manifest = ${JSON.stringify(manifest)}`,
        onShellReady() {
          resolve(stream2);
        },
        onError(error, info) {
          console.log(error, info);
          reject(error);
        }
      });
    }
  );
  setHeader(event, "content-type", "text/html");
  return stream.pipe(injectToHead(assets.head));
});
function injectToHead(data) {
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
    }
  });
}
function splitFirst(s, sep) {
  let i = s.indexOf(sep);
  if (i === -1) {
    i = s.length;
  }
  return [s.slice(0, i), s.slice(i + sep.length)];
}
