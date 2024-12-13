import "./global.css";

import { ReactNode, Suspense } from "react";
import ClientComponent from "./ClientComponent";
import ServerComponent from "./ServerComponent";

export default async function Page({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <h1>HELLO WORLD</h1>
        {/* <ul> */}
        {/*   <li> */}
        {/*     <Link href="/">Home</Link> */}
        {/*   </li> */}
        {/*   <li> */}
        {/*     <Link href="/users">Users</Link> */}
        {/*   </li> */}
        {/* </ul> */}
        <Suspense>
          <ServerComponent delay={1000} />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
