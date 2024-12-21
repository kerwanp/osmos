import { Sidebar } from "../components/sidebar";
import "./global.css";

import { ReactNode } from "react";

export default async function Page({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body className="min-h-screen relative flex">
        <Sidebar />
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
