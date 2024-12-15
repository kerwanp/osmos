import { EventHandler } from "h3";
import { NitroApp } from "nitropack/types";
export default function global(app: NitroApp): void;
declare global {
    var __nitro_handler: EventHandler;
}
