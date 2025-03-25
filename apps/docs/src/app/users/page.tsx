import { Suspense } from "react";
import ServerComponent from "../ServerComponent";

export default function Page() {
  return (
    <div>
      <h2>USERS TESTEST</h2>
      <Suspense fallback="Loading users...">
        <ServerComponent delay={500} />
      </Suspense>
    </div>
  );
}
