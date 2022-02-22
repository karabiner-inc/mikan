import { AsyncRay, NodeHtmlMarkdown, remark } from "./deps.ts";

/**
 * Convert inline html to markdown syntax as much as possible
 * @param md markdown string
 */
export const convert = async (md: string) => {
  const processor = remark();
  const ast = await processor.parse(md);

  ast.children = await AsyncRay(ast.children).aMap(async (child) => {
    if (child.type === "html") {
      const md = NodeHtmlMarkdown.translate(child.value);
      const childAst = await processor.parse(md);
      return childAst.children[0];
    }
    return child;
  });

  const file = await processor.stringify(ast);

  return file as string;
};
