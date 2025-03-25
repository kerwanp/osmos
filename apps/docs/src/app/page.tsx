import { source } from "@/lib/source";
import defaultMdxComponents from "fumadocs-ui/mdx";

export default function Page() {
  const page = source.getPage(["introduction"]);
  if (!page) throw new Error("Page not found");

  const MDX = page.data.body;

  return (
    <div>
      <h2>Homepage</h2>
      <MDX components={{ ...defaultMdxComponents }} />
    </div>
  );
}
