import { hydrateRoot, renderRoot } from "./client";

if (import.meta.hot) {
  import.meta.hot.on("rsc-update", () => {
    renderRoot();
  });
}

// TODO: Move this in vite plugin
// @ts-expect-error
window.__osmos_resolve_client_ref = (bundlerConfig: string, metadata: any) => {
  const url = metadata[0];
  const name = metadata[1];

  const resolvedUrl = import.meta.env.DEV
    ? url
    : // @ts-expect-error
      window.__manifest[url].clientAsset;

  return {
    specifier: bundlerConfig + resolvedUrl,
    name,
  };
};

hydrateRoot(document, {});
