"use client";

import React from "react";
import { useLinkClickHandler } from "./hooks/useLinkClickHandler";

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ onClick, href, ...props }, ref) => {
    const internalOnClick = useLinkClickHandler(href);

    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
      if (onClick) onClick(event);
      if (event.defaultPrevented) return;

      internalOnClick(event);
    };

    return <a href={href} onClick={handleClick} {...props} ref={ref} />;
  },
);

export default Link;
