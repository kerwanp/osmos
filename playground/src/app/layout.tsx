import "./global.css";

import { PropsWithChildren, ReactNode, StrictMode } from "react";
import { MYSYMBOL, TestProvider } from "@/providers/test.provider";
import TestPage from "./users/create/page";

async function TestComponent({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

export default async function Page({ children }: { children: ReactNode }) {
  return (
    <StrictMode>
      <html lang="en">
        <head></head>
        <body className="min-h-screen relative flex dark">
          <TestProvider>
            <TestPage symbol={MYSYMBOL} />
          </TestProvider>
        </body>
      </html>
    </StrictMode>
  );
}
