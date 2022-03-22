import {
  AsyncRay,
  NodeHtmlMarkdown,
  Parent,
  remark,
  remarkFrontmatter,
  remarkGfm,
  Root,
} from "./deps.ts";
import { hasIframe, log } from "./util.ts";
import type { Attachment, Result } from "../processor/yaml.ts";

type ConverterParam<T> = {
  readonly mdString: string;
  readonly fileName: string;
  readonly frontmatterProcessor: (yamlString: string) => Result<T>;
};

type ConvertedMarkdown = {
  md: string;
  frontmatter: any;
};

/**
 * Convert inline html to markdown syntax as much as possible
 *
 * support tag
 * <iframe> -> output log
 * Table -> output log
 * <img> -> convert ![](url)
 *
 * frontmatter support
 * yaml
 *
 * @param param
 * @param param.mdString string of markdown
 * @param param.fileName
 * @param param.frontmatterProcessor function processing frontmatter
 *
 * @returns return
 * @returns return.md converted string of markdown
 * @returns return.frontmatter frontmatte object
 */
export async function convert(
  param: ConverterParam<Attachment[]>,
): Promise<ConvertedMarkdown> {
  let frontmatter;
  const processor = remark()
    .use(remarkGfm) // support github-flavored-markdown
    .use(remarkFrontmatter) // support frontmatter
  ;
  const ast: Parent = await processor.parse(param.mdString);

  ast.children = await AsyncRay(ast.children).aMap(async (child) => {
    switch (child.type) {
      case "html":
        // if iframe tag found, output log
        if (hasIframe(child.value)) {
          log({ fileName: param.fileName, type: "iframe" });
        } else {
          // convert html -> md
          const md = NodeHtmlMarkdown.translate(child.value);
          const childAst = await processor.parse(md);
          return childAst.children[0];
        }
        break;
      case "table":
        log({ fileName: param.fileName, type: "table" });
        break;
      case "yaml":
        frontmatter = param.frontmatterProcessor(child.value);
        break;
    }
    return child;
  });

  const md = processor.stringify(ast as Root) as string;

  return { md, frontmatter };
}
