import { Suspense } from "react";
import ServerComponent from "./ServerComponent";
import ClientComponent, { SecondClientComponent } from "./ClientComponent";
import { Link } from "@osmosjs/osmos/link";

export default function Page() {
  return (
    <div>
      <h2>Homepage</h2>
      <Link href="/">Hello</Link>
      <ClientComponent />
      <SecondClientComponent />
      <Suspense fallback="Loading...">
        <ServerComponent delay={500} />
      </Suspense>
    </div>
  );
}
