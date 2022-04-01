import { assert, assertEquals } from "../../dev_deps.ts";
import { existsFile } from "../util.ts";
import { pathResolverFactory } from "../../util.ts";
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
  const fileName = "./test_img.md";
  const testFilePath = resolve(fileName);
  const md = await Deno.readTextFile(testFilePath);
  const actual = await convert(md, fileName);

  assertEquals(actual, expect);
});

Deno.test("convert from file with log", async () => {
  const testIframeFile = resolve("./test_iframe.md");
  const testIframe = await Deno.readTextFile(testIframeFile);
  await convert(testIframe, testIframeFile);

  const testTableFile = resolve("./test_table.md");
  const testTable = await Deno.readTextFile(testTableFile);
  await convert(testTable, testTableFile);

  existsFile("output.json")
    .then((result) => assert(result));
});
