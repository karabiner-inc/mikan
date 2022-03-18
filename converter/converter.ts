import {
  AsyncRay,
  NodeHtmlMarkdown,
  Parent,
  remark,
  remarkGfm,
} from "./deps.ts";
import { log } from "./util.ts";

/**
 * return true if str has iframe tag
 */
const hasIframe = (htmlString: string): boolean => {
  return htmlString.search(/<iframe/) !== -1;
};

/**
 * Convert inline html to markdown syntax as much as possible
 * support tag
 * <iframe> -> output log
 * Table -> output log
 * <img> -> convert ![](url)
 * @param md markdown string
 */
export const convert = async (md: string, fileName?: string) => {
  const processor = remark().use(remarkGfm);
  const ast: Parent = await processor.parse(md);

  ast.children = await AsyncRay(ast.children).aMap(async (child) => {
    switch (child.type) {
      case "html":
        // if iframe tag found, output log
        if (hasIframe(child.value)) {
          log({ fileName, type: "iframe" });
        } else {
          // convert html -> md
          const md = NodeHtmlMarkdown.translate(child.value);
          const childAst = await processor.parse(md);
          return childAst.children[0];
        }
        break;
      case "table":
        log({ fileName, type: "table" });
        break;
    }
    return child;
  });

  const file = processor.stringify(ast as Root);

  return file as string;
};
