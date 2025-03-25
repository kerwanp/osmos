import { RootProvider } from "fumadocs-ui/provider";
import "./global.css";

import { ReactNode } from "react";

export default function Page({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
