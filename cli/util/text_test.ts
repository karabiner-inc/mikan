import { getFileTitle } from "./text.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test("simple file name", () => {
  const filePath = "./md/dir1/dir2/idr3/test.md";
  const result = getFileTitle(filePath);
  const expect = "test";
  assertEquals(result, expect);
});

Deno.test("title having multi dot", () => {
  const filePath = "./md/dir1/dir2/idr3/test.back.md";
  const result = getFileTitle(filePath);
  const expect = "test.back";
  assertEquals(result, expect);
});

Deno.test("title with space", () => {
  const filePath = "./md/dir1/dir2/idr3/test test.md";
  const result = getFileTitle(filePath);
  const expect = "test test";
  assertEquals(result, expect);
});
