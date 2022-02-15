import { assertEquals, AsyncRay, NodeHtmlMarkdown, remark } from "./deps.ts";

export const parser = async (md: string) => {
  const processor = remark();
  const ast = await processor.parse(md);
  ast.children = await AsyncRay(ast.children).aMap(async (child) => {
    if (child.type === "html") {
      const md = NodeHtmlMarkdown.translate(child.value);
      const childAst = await processor.parse(md);
      // console.dir(childAst, { depth: 100 });
      return childAst.children[0];
    }
    return child;
  });
  // console.dir(ast, { depth: 100 });
  const file = await processor.stringify(ast);
  return file as string;
};

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

  const resultMarkdown = await parser(testMarkdown);
  assertEquals(resultMarkdown, expectMarkdown);
});

Deno.test("convert empty", async () => {
  const testMarkdown = "";
  const expectMarkdown = "";

  const resultMarkdown = await parser(testMarkdown);
  assertEquals(resultMarkdown, expectMarkdown);
});
