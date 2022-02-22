import { assertEquals, pathResolverFactory } from "../../dev_deps.ts";
import { convert } from "../converter.ts";

const resolve = pathResolverFactory(import.meta);

Deno.test("convert img-tag", async () => {
  const testMarkdown = `# title

<img src="hoge" alt="hoge">

![](hoge)

## subtitle
`;
  const expectMarkdown = `# title

![hoge](hoge)

![](hoge)

## subtitle
`;

  assertEquals(await convert(testMarkdown), expectMarkdown);
});

Deno.test("convert empty", async () => {
  const testMarkdown = "";
  const expectMarkdown = "";

  assertEquals(await convert(testMarkdown), expectMarkdown);
});

Deno.test("convert from file", async () => {
  const expect = `# title

![hoge](hoge)

![](hoge)

## subtitle
`;
  const testFilePath = resolve("./test.md");
  const md = await Deno.readTextFile(testFilePath);
  const actual = await convert(md);

  assertEquals(actual, expect);
});
