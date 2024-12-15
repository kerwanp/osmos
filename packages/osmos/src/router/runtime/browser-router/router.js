import ReactServerDOM from "react-server-dom-esm/client";
import React from "react";
import { render } from "./dom.js";
import { TypedEventTarget } from "../../types/event-target";
export class BrowserRouter extends TypedEventTarget {
  constructor() {
    super();
    if (typeof window === "undefined") return;
    const originalPushState = window.history.pushState.bind(window.history);
    window.history.pushState = (data, unused, url) => {
      originalPushState(data, unused, url);
      if (url) {
        const path = new URL(url, window.location.href).pathname;
        this.#render(path);
      }
    };
    const originalReplaceState = window.history.replaceState.bind(
      window.history
    );
    window.history.replaceState = (data, unused, url) => {
      originalReplaceState(data, unused, url);
      if (url) {
        const path = new URL(url, window.location.href).pathname;
        this.#render(path);
      }
    };
    window.addEventListener("popstate", (event) => {
      if (!event.state?.url) {
        return;
      }
      const path = new URL(event.state.url, window.location.href).pathname;
      this.#render(path);
    });
  }
  #render(path) {
    React.startTransition(async () => {
      const promise = await fetchRsc(path);
      render(promise);
    });
  }
  push(url) {
    window.history.pushState({ url }, "", url);
  }
}
function fetchRsc(path) {
  const initialContentFetchPromise = fetch(`/_rsc${path}`);
  const initialContentPromise = ReactServerDOM.createFromFetch(
    initialContentFetchPromise,
    {
      moduleBaseURL: "/_osmos"
    }
  );
  return initialContentPromise;
}
export function createBrowserRouter() {
  return new BrowserRouter();
}
