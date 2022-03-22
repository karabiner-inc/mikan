import { extname } from "../../deps.ts";
import { markdownToBlocks } from "../deps.ts";
import { Converter } from "../../converter/converter.ts";
import { parseYamlAndProcessAttachments } from "../../processor/yaml.ts";

/**
 * markdownをNotionブロックに変換
 */
export async function convertMarkdownToNotionBlock(filePath: string) {
  if (extname(filePath) !== ".md") {
    throw new Error("cannot support file type");
  }

  try {
    const content = Deno.readTextFileSync(filePath);
    // TODO: converterは外部注入できるようにリファクタリングする
    const converter = new Converter(parseYamlAndProcessAttachments);
    const { md, frontmatter } = await converter.convert({
      mdString: content,
      fileName: filePath,
    });
    const blocks = markdownToBlocks(md, true);
    return { blocks, frontmatter };
  } catch (e) {
    throw e;
  }
}
