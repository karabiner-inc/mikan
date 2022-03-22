import { readDirRecursively } from "../util/fs.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test("test for readDirRecursively()", () => {
  const result = readDirRecursively("./test");
  const expect = ["./temp/dir1/test.md", "./temp/dir1/dir2/dir3/test.md"];
  assertEquals(result, expect);
});
