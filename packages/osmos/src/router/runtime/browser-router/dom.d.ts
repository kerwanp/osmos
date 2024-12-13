import React from "react";
import { HydrationOptions, Root } from "react-dom/client";
export declare function hydrateRoot(container: Document | Element, initialChildren: React.ReactNode, options?: HydrationOptions): void;
export declare function render(children: React.ReactNode): void;
declare global {
    var __osmos_root: Root;
}
