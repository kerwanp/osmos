import { RootProvider } from "fumadocs-ui/provider";
import "./global.css";

import { ReactNode } from "react";
import { TestProvider } from "@/providers/test.provider";

export default function Page({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col h-screen">
        <TestProvider>
          <RootProvider>{children}</RootProvider>
        </TestProvider>
      </body>
    </html>
  );
}
