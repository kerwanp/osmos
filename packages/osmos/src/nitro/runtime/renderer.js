import { eventHandler } from "h3";
import ssrHandler from "../../ssr/runtime/handler";
export default eventHandler(async (event) => {
  const stream = await ssrHandler(event);
  console.log(import.meta.prerender);
  return stream;
});
