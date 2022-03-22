import {
  Chain,
  NodeHtmlMarkdown,
  Parent,
  remark,
  remarkFrontmatter,
  remarkGfm,
  Root,
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
  private mdParser = remark()
    .use(remarkGfm) // support github-flavored-markdown
    .use(remarkFrontmatter);

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
    const ast: Parent = await this.mdParser.parse(param.mdString);

    ast.children = await Chain(ast.children)
      .aMap(async (child) => {
        switch (child.type) {
          case "html":
            // if iframe tag found, output log
            if (hasIframe(child.value)) {
              log({ fileName: param.fileName, type: "iframe" });
            } else {
              // convert html -> md
              const md = NodeHtmlMarkdown.translate(child.value);
              const childAst = await this.mdParser.parse(md);
              return childAst.children[0];
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
      })
      .aFilter((child) => Promise.resolve(child.type !== "yaml"))
      .process();
    // remove frontmatter
    // ast.children = ast.children.filter((child) => child.type !== "yaml");

    const md = this.mdParser.stringify(ast as Root) as string;

    return { md, frontmatter };
  }
}
