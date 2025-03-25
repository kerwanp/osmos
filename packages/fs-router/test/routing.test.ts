import { fileURLToPath } from "url";
import { createFileSystemRouter } from "../src";
import { join } from "path";

it("test", async () => {
  const base = fileURLToPath(new URL("./fixtures/simple", import.meta.url));

  const router = createFileSystemRouter({
    dir: base,
    files: {
      page: {
        verifier() {
          return true;
        },
      },
      layout: {
        verifier() {
          return true;
        },
      },
    },
  });

  router.addFile(join(base, "page.tsx"));
  router.addFile(join(base, "layout.tsx"));
  router.addFile(join(base, "users/page.tsx"));

  expect(router.getRoutes()).toEqual({
    path: base,
    url: "/",
    files: {
      layout: {
        path: join(base, "layout.tsx"),
      },
      page: {
        path: join(base, "page.tsx"),
      },
    },
    directories: {
      users: {
        path: join(base, "users"),
        url: "/users",
        files: {
          page: {
            path: join(base, "users/page.tsx"),
          },
        },
        directories: {},
      },
    },
  });

  router.removeFile(join(base, "users/page.tsx"));

  expect(router.getRoutes()).toEqual({
    path: base,
    url: "/",
    files: {
      layout: {
        path: join(base, "layout.tsx"),
      },
      page: {
        path: join(base, "page.tsx"),
      },
    },
    directories: {
      users: {
        path: join(base, "users"),
        url: "/users",
        directories: {},
        files: {},
      },
    },
  });
});
