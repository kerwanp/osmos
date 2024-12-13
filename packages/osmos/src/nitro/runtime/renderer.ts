import { eventHandler } from "h3";
import ssrHandler from "../../ssr/runtime/handler";

export default eventHandler(async (event) => {
  const stream = await ssrHandler(event);

  // const response = await new Promise((resolve, reject) => {
  //   let res = "";
  //   const td = new TextDecoder();
  //
  //   stream.on("data", (chunk) => {
  //     res += td.decode(chunk);
  //   });
  //
  //   stream.on("error", reject);
  //   stream.on("finish", () => {
  //     resolve(res);
  //   });
  // });

  return stream;
});
