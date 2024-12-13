import { TypedEventTarget } from "../types/event-target";
export class PushEvent extends Event {
  state;
  url;
  constructor(state, url) {
    super("push");
    this.state = state;
    this.url = url;
  }
}
export class ReplaceEvent extends Event {
  state;
  url;
  constructor(state, url) {
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
export class BrowserHistory extends TypedEventTarget {
  length = 0;
  scrollRestoration = "auto";
  state;
  constructor() {
    super();
    if (typeof window === "undefined") return;
    window.addEventListener("popstate", (ev) => {
      this.dispatchEvent("pop", new PopEvent());
    });
  }
  back() {
    window.history.back();
  }
  forward() {
    window.history.forward();
  }
  go(delta) {
    window.history.go(delta);
  }
  pushState(data, unused, url) {
    window.history.pushState(data, unused, url);
    this.dispatchEvent("push", new PushEvent(data, url));
  }
  replaceState(data, unused, url) {
    window.history.replaceState(data, unused, url);
    this.dispatchEvent("replace", new ReplaceEvent(data, url));
  }
}
export function createBrowserHistory() {
  return new BrowserHistory();
}
