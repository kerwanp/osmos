import { fileURLToPath } from "url";
import getDirectoryTree from "../src/fs/utils/getDirectoryTree";
import scanDir from "../src/fs/utils/scanDir";

describe("getDirectoryTree", () => {
  it("should workd", () => {
    const files = scanDir({
      extensions: ["ts", "tsx"],
      dir: fileURLToPath(new URL("./fixtures/simple", import.meta.url)),
    });

    const tree = getDirectoryTree({
      base: "",
      files: ["/_layout.tsx", "/index.tsx"],
    });

    expect(tree).toEqual([
      {
        type: "layout",
        file: "/_layout.tsx",
        children: [
          {
            type: "page",
            file: "/index.tsx",
          },
        ],
      },
    ]);
  });
});

// it("praseFilePath", () => {
//   expect(parseFilePath({ filePath: "src/page.tsx", dir: "src" })).toEqual({
//     type: "page",
//     src: "src/page.tsx",
//     path: "/",
//   });
//
//   expect(parseFilePath({ filePath: "src/users/page.tsx", dir: "src" })).toEqual(
//     {
//       type: "page",
//       src: "src/users/page.tsx",
//       path: "/users",
//     },
//   );
//
//   expect(
//     parseFilePath({ filePath: "src/users/[id]/layout.tsx", dir: "src" }),
//   ).toEqual({
//     type: "layout",
//     src: "src/users/[id]/layout.tsx",
//     path: "/users/[id]",
//   });
// });

// describe("FileSystemRouter", () => {
//   it("should work with simple", async () => {
//     const router = new FileSystemRouter({
//       extensions: ["tsx"],
//       dir: fileURLToPath(new URL("./fixtures/simple", import.meta.url)),
//     });
//
//     const routes = await router.getRoutes();
//
//     expect(routes).toEqual([
//       {
//         path: "/",
//         source: "/",
//       },
//     ]);
//   });
// });
