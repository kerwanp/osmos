import ReactServerDOM from "@osmos/react-server-dom-esm/client";
import React from "react";
import { TypedEventTarget } from "../types/event-target";
import { render } from "./dom";

interface BrowserRouterEvents {}

export class BrowserRouter extends TypedEventTarget<BrowserRouterEvents> {
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
      window.history,
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

  #render(path: string) {
    React.startTransition(async () => {
      const promise = await fetchRsc(path);
      render(promise);
    });
  }

  push(url: string) {
    window.history.pushState({ url }, "", url);
  }
}

function fetchRsc(path: string) {
  const initialContentFetchPromise = fetch(`/_rsc${path}`);
  const initialContentPromise = ReactServerDOM.createFromFetch(
    initialContentFetchPromise,
    {
      moduleBaseURL: "/_osmos",
    },
  );

  return initialContentPromise;
}

export function createBrowserRouter() {
  return new BrowserRouter();
}
