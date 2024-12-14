import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>create-osmos</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
