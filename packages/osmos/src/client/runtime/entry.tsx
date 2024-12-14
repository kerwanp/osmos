import React from "react";
import { createFromFetch, encodeReply } from "react-server-dom-esm/client";
import { hydrateRoot } from "../../router/runtime/browser-router/dom";

const getGlobalLocation = () =>
  window.location.pathname + window.location.search;

const initialLocation = getGlobalLocation();
const initialContentFetchPromise = fetch(`/_server${initialLocation}`);
const initialContentPromise = createFromFetch(initialContentFetchPromise, {
  moduleBaseURL: "/_osmos",
  callServer,
});

async function callServer(id: string, args: any) {
  const fetchPromise = fetch(`/_server${getGlobalLocation()}`, {
    method: "POST",
    headers: { "server-function": id },
    body: await encodeReply(args),
  });

  const responsePromise = createFromFetch(fetchPromise);
  const returnValue = await responsePromise;

  return returnValue;
}

function ServerRoot() {
  const content = React.use(initialContentPromise);
  return content as React.ReactNode;
}

hydrateRoot(document, <ServerRoot />, {});
