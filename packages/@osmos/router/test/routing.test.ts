import { parse, tokenize } from "../src/utils/match";

it("should parse file path routing to matchit pattern", () => {
  expect(parse("/")).toBe("/");
  expect(parse("/users")).toBe("/users");
  expect(parse("/users/[userId]/edit")).toBe("/users/:userId/edit");
  expect(parse("/[id]")).toBe("/:id");
  expect(parse("/catch-all/[...segments]")).toBe("/catch-all/*");
});

it("should transform file path routing to matchit tokens", () => {
  expect(tokenize("/")).toEqual([{ old: "/", end: "", type: 0, val: "/" }]);
  expect(tokenize("/users")).toEqual([
    { old: "/users", end: "", type: 0, val: "users" },
  ]);
});
