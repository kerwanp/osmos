import { useCallback } from "react";
import { useRouter } from "../useRouter.js";
export function useLinkClickHandler(href) {
  const router = useRouter();
  return useCallback(
    (event) => {
      if (!href) return;
      event.preventDefault();
      router.push(href);
    },
    [href]
  );
}
