import "./global.css";

import { ReactNode } from "react";
import { Test } from "./Test";

export default function Page({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>
        {children}
        <Test />
      </body>
    </html>
  );
}
