import {
  Chain,
  formatFromString,
  NodeHtmlMarkdown,
  Parent,
  rehypeRaw,
  rehypeRemark,
  remark,
  remarkFrontmatter,
  remarkGfm,
  remarkParse,
  remarkRehype,
  remarkStringify,
  Root,
  unified,
} from "./deps.ts";
import { hasIframe, log } from "./util.ts";
import type {
  Attachment,
  FrontmatterProcessor,
  Result,
} from "../processor/yaml.ts";

type ConverterParam = {
  readonly mdString: string;
  readonly fileName: string;
};

type ConvertedMarkdown = {
  readonly md: string;
  readonly frontmatter: Result<Attachment[]>;
};

export class Converter {
  private frontmatterProcessor: FrontmatterProcessor<Attachment[]>;
  private mdParser = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm) // support github-flavored-markdown
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeRemark)
    .use(remarkStringify);

  private remarkParser = remark()
    .use(remarkGfm)
    .use(remarkFrontmatter); // support github-flavored-markdown

  constructor(
    frontmatterProcessor: FrontmatterProcessor<Attachment[]>,
  ) {
    this.frontmatterProcessor = frontmatterProcessor;
  }

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
  async convert(param: ConverterParam): Promise<ConvertedMarkdown> {
    let frontmatter: Result<Attachment[]> = { valid: false, value: undefined };
    (this.remarkParser.parse(param.mdString) as Parent).children
      .map((child) => {
        switch (child.type) {
          case "html":
            // if iframe tag found, output log
            if (hasIframe(child.value)) {
              log({ fileName: param.fileName, type: "iframe" });
            }
            break;
          case "table":
            log({ fileName: param.fileName, type: "table" });
            break;
          case "yaml":
            frontmatter = this.frontmatterProcessor(child.value);
            break;
        }
        return child;
      });

    const file = await this.mdParser.process(param.mdString);
    const ast: Parent = this.remarkParser.parse(file);

    ast.children = ast.children
      .map((child) => {
        switch (child.type) {
          case "html":
            // if iframe tag found, output log
            if (hasIframe(child.value)) {
              child.value = "";
            } else {
              // convert html -> md
              const md = NodeHtmlMarkdown.translate(child.value);
              const childAst = this.mdParser.parse(md);
              return childAst.children[0];
            }
            break;
        }
        return child;
      })
      .filter((child) => {
        return child !== undefined && child.type !== "yaml";
      });
    const md = this.remarkParser.stringify(ast as Root) as string;
    const { value } = await formatFromString(String(md));

    return {
      md: (value as string)
        .replaceAll("* ", "- ")
        .replaceAll(/\n\s{4,}/g, "\n    ")
        .replaceAll("\n\n", "\n")
        .replaceAll(/(!\[.*\]\(.*\))/g, "\n\n$1\n\n"),
      frontmatter,
    };
  }
}
