import { Suspense } from "react";
import ServerComponent from "./ServerComponent";

export default function Page() {
  return (
    <div>
      <h2>Homepage</h2>
      <Suspense fallback="Loading...">
        <ServerComponent delay={500} />
      </Suspense>
    </div>
  );
}
