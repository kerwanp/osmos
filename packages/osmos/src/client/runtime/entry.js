import { jsx } from "react/jsx-runtime";
import React from "react";
import { createFromFetch, encodeReply } from "react-server-dom-esm/client";
import { hydrateRoot } from "../../router/runtime/browser-router/dom";
window.__osmos_resolve_client_ref = (bundlerConfig, metadata) => {
  const url = metadata[0];
  const name = metadata[1];
  const resolvedUrl = import.meta.env.DEV ? url : (
    // @ts-expect-error
    window.__manifest[url].clientAsset
  );
  return {
    specifier: bundlerConfig + resolvedUrl,
    name
  };
};
const getGlobalLocation = () => window.location.pathname + window.location.search;
const initialLocation = getGlobalLocation();
const initialContentFetchPromise = fetch(`/_server${initialLocation}`);
const initialContentPromise = createFromFetch(initialContentFetchPromise, {
  moduleBaseURL: "/_osmos",
  callServer
});
async function callServer(id, args) {
  const fetchPromise = fetch(`/_server${getGlobalLocation()}`, {
    method: "POST",
    headers: { "server-function": id },
    body: await encodeReply(args)
  });
  const responsePromise = createFromFetch(fetchPromise);
  const returnValue = await responsePromise;
  return returnValue;
}
function ServerRoot() {
  const content = React.use(initialContentPromise);
  return content;
}
hydrateRoot(document, /* @__PURE__ */ jsx(ServerRoot, {}), {});