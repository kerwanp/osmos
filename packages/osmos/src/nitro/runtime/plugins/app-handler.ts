import { EventHandler } from "h3";
import { NitroApp } from "nitropack/types";

export default function global(app: NitroApp) {
  globalThis.__nitro_handler = app.h3App.handler;
}

declare global {
  var __nitro_handler: EventHandler;
}
