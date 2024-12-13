import { TypedEventTarget } from "../types/event-target";
interface BrowserRouterEvents {
}
export declare class BrowserRouter extends TypedEventTarget<BrowserRouterEvents> {
    #private;
    constructor();
    push(url: string): void;
}
export declare function createBrowserRouter(): BrowserRouter;
export {};
