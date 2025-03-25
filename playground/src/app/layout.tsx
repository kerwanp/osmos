import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import "./global.css";

import { ReactNode, StrictMode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { TestProvider } from "@/providers/test.provider";

export default async function Page({ children }: { children: ReactNode }) {
  console.log("RENDERED");
  return (
    <StrictMode>
      <html lang="en">
        <head></head>
        <body className="min-h-screen relative flex dark">
          <TestProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <SidebarTrigger />
                <main className="p-4">{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </TestProvider>
        </body>
      </html>
    </StrictMode>
  );
}
