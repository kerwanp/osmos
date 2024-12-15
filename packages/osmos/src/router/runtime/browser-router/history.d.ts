import { TypedEventTarget } from "../types/event-target";
export declare class PushEvent extends Event {
    state: any;
    url?: string | URL | null;
    constructor(state: any, url?: string | URL | null);
}
export declare class ReplaceEvent extends Event {
    state: any;
    url?: string | URL | null;
    constructor(state: any, url?: string | URL | null);
}
export declare class PopEvent extends Event {
    constructor();
}
export interface BrowserHistoryEvents {
    push: PushEvent;
    replace: ReplaceEvent;
    pop: PopEvent;
}
export declare class BrowserHistory extends TypedEventTarget<BrowserHistoryEvents> implements History {
    length: number;
    scrollRestoration: ScrollRestoration;
    state: any;
    constructor();
    back(): void;
    forward(): void;
    go(delta?: number): void;
    pushState(data: any, unused: string, url?: string | URL | null): void;
    replaceState(data: any, unused: string, url?: string | URL | null): void;
}
export declare function createBrowserHistory(): BrowserHistory;
