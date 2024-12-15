export default function global(app) {
  globalThis.__nitro_handler = app.h3App.handler;
}
