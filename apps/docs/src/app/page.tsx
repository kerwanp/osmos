import Test from "../../content/docs/introduction.mdx";
import { ClientComponent } from "./ClientComponent";

export default async function Page() {
  return (
    <div>
      <h2>Homepage</h2>
      <Test />
      <ClientComponent />
    </div>
  );
}
