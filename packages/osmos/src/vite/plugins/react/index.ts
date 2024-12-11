import reactServer from "./react-server";
import { reactSSR } from "./react-ssr";

export default function react() {
  return [reactServer(), reactSSR()];
}
