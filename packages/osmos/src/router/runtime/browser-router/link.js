"use client";
import { jsx } from "react/jsx-runtime";
import React from "react";
import { useLinkClickHandler } from "./hooks/useLinkClickHandler.js";
const Link = React.forwardRef(
  ({ onClick, href, ...props }, ref) => {
    const internalOnClick = useLinkClickHandler(href);
    const handleClick = (event) => {
      if (onClick) onClick(event);
      if (event.defaultPrevented) return;
      internalOnClick(event);
    };
    return /* @__PURE__ */ jsx("a", { href, onClick: handleClick, ...props, ref });
  }
);
export default Link;
