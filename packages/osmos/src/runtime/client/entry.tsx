import React from "react";
import { createFromFetch, encodeReply } from "react-server-dom-esm/client";
import { hydrateRoot } from "../../router/browser/dom";
// @ts-expect-error
import test from "$osmos/client-references";

console.log(test);

const getGlobalLocation = () =>
  window.location.pathname + window.location.search;

const initialLocation = getGlobalLocation();
const initialContentFetchPromise = fetch(`/_rsc${initialLocation}`);
const initialContentPromise = createFromFetch(initialContentFetchPromise, {
  moduleBaseURL: "/_osmos",
  callServer,
});

async function callServer(id: string, args: any) {
  const fetchPromise = fetch(`/_rsc${getGlobalLocation()}`, {
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
