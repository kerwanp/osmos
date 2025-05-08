import React from "react";
import {
  hydrateRoot as _hydrateRoot,
  HydrationOptions,
  Root,
} from "react-dom/client";
import { createFromFetch, encodeReply } from "react-server-dom-esm/client";
import assets from "virtual:react-server:assets";

globalThis.__vite__ = {
  import: (id: string) => {
    return assets[id].import();
  },
};

const getGlobalLocation = () =>
  window.location.pathname + window.location.search;

export function fetchRSC(location: string) {
  const fetchPromise = fetch(`/_server${location}`);
  return createFromFetch(fetchPromise, {
    moduleBaseURL: "",
    callServer,
  });
}

export async function callServer(id: string, args: any) {
  const fetchPromise = fetch(`/_server${getGlobalLocation()}`, {
    method: "POST",
    headers: { "server-function": id },
    body: await encodeReply(args),
  });

  const responsePromise = createFromFetch(fetchPromise);
  const returnValue = await responsePromise;

  return returnValue;
}

function ServerRoot({ promise }: { promise: any }) {
  const content = React.use(promise);
  return content as React.ReactNode;
}

export function hydrateRoot(
  container: Document | Element,
  options?: HydrationOptions,
) {
  const initialContentFetchPromise = fetchRSC(getGlobalLocation());

  React.startTransition(() => {
    console.log("TRANSITION");
    window.__osmos_root = _hydrateRoot(
      container,
      <ServerRoot promise={initialContentFetchPromise} />,
      options,
    );
  });
}

export function renderRoot() {
  const initialContentFetchPromise = fetchRSC(getGlobalLocation());

  React.startTransition(() => {
    __osmos_root.render(<ServerRoot promise={initialContentFetchPromise} />);
  });
}

declare global {
  var __osmos_root: Root;
}
