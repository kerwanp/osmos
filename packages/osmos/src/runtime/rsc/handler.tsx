import { eventHandler, setHeaders } from "h3";
import { renderer } from "./renderer";

export default eventHandler(async (event) => {
  const stream = renderer(event.path);

  setHeaders(event, {
    "content-type": "text/x-component",
    Router: "rsc",
  });

  return stream;
});
