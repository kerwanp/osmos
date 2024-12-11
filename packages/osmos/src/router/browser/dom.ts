import React from "react";
import {
  hydrateRoot as _hydrateRoot,
  HydrationOptions,
  Root,
} from "react-dom/client";

export function hydrateRoot(
  container: Document | Element,
  initialChildren: React.ReactNode,
  options?: HydrationOptions,
) {
  React.startTransition(() => {
    window.__osmos_root = _hydrateRoot(container, initialChildren, options);
  });
}

export function render(children: React.ReactNode) {
  React.startTransition(() => {
    window.__osmos_root.render(children);
  });
}

declare global {
  var __osmos_root: Root;
}
