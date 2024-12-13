"use client";
import React from "react";
import {
  hydrateRoot as _hydrateRoot
} from "react-dom/client";
export function hydrateRoot(container, initialChildren, options) {
  React.startTransition(() => {
    window.__osmos_root = _hydrateRoot(container, initialChildren, options);
  });
}
export function render(children) {
  React.startTransition(() => {
    window.__osmos_root.render(children);
  });
}
