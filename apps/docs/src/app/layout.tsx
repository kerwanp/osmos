import "./global.css";

import { ReactNode } from "react";

export default async function Page({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
