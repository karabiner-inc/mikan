import { extname } from "../../deps.ts";
import { convert } from "../../converter/converter.ts";
import { parseYamlAndProcessAttachments } from "../../processor/yaml.ts";
import { markdownToBlocks } from "../deps.ts";

/**
 * markdownをNotionブロックに変換
 */
export async function convertMarkdownToNotionBlock(filePath: string) {
  if (extname(filePath) !== ".md") {
    throw new Error("cannot support file type");
  }

  try {
    const content = Deno.readTextFileSync(filePath);
    const { md, frontmatter } = await convert({
      mdString: content,
      fileName: filePath,
      frontmatterProcessor: parseYamlAndProcessAttachments,
    });
    return markdownToBlocks(md, true);
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return [];
  }
}
