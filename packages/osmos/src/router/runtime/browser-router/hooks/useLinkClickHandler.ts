import React, { useCallback } from "react";
import { useRouter } from "../useRouter";

export function useLinkClickHandler<E extends Element = HTMLAnchorElement>(
  href?: string,
) {
  const router = useRouter();

  return useCallback(
    (event: React.MouseEvent<E>) => {
      if (!href) return;

      event.preventDefault();
      router.push(href);
    },
    [href],
  );
}
