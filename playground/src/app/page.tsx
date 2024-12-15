import { Suspense } from "react";
import ServerComponent from "./ServerComponent";
import ClientComponent from "./ClientComponent";

export default function Page() {
  return (
    <div>
      <h2>Homepage</h2>
      <ClientComponent />
      <Suspense fallback="Loading...">
        <ServerComponent delay={500} />
      </Suspense>
    </div>
  );
}
