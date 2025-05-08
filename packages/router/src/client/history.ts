import { TypedEventTarget } from "../types/event-target";

export class PushEvent extends Event {
  state: any;
  url?: string | URL | null;

  constructor(state: any, url?: string | URL | null) {
    super("push");
    this.state = state;
    this.url = url;
  }
}

export class ReplaceEvent extends Event {
  state: any;
  url?: string | URL | null;

  constructor(state: any, url?: string | URL | null) {
    super("replace");
    this.state = state;
    this.url = url;
  }
}

export class PopEvent extends Event {
  constructor() {
    super("pop");
  }
}

export interface BrowserHistoryEvents {
  push: PushEvent;
  replace: ReplaceEvent;
  pop: PopEvent;
}

export class BrowserHistory
  extends TypedEventTarget<BrowserHistoryEvents>
  implements History
{
  length = 0;
  scrollRestoration: ScrollRestoration = "auto";

  state: any;

  constructor() {
    super();

    if (typeof window === "undefined") return;
    window.addEventListener("popstate", (ev) => {
      this.dispatchEvent("pop", new PopEvent());
    });
  }

  back(): void {
    window.history.back();
  }

  forward(): void {
    window.history.forward();
  }

  go(delta?: number): void {
    window.history.go(delta);
  }

  pushState(data: any, unused: string, url?: string | URL | null): void {
    window.history.pushState(data, unused, url);
    this.dispatchEvent("push", new PushEvent(data, url));
  }

  replaceState(data: any, unused: string, url?: string | URL | null): void {
    window.history.replaceState(data, unused, url);
    this.dispatchEvent("replace", new ReplaceEvent(data, url));
  }
}

export function createBrowserHistory() {
  return new BrowserHistory();
}
