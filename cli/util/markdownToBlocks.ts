import { extname } from "../../deps.ts";
import { convert } from "../../converter/mod.ts";
import { markdownToBlocks } from "../deps.ts";

/**
 * markdownをNotionブロックに変換
 */
export const convertMarkdownToNotionBlock = async (filePath: string) => {
  if (extname(filePath) !== ".md") {
    throw new Error("cannot support file type");
  }

  try {
    const content = Deno.readTextFileSync(filePath);
    const converted = await convert(content, filePath);
    return markdownToBlocks(converted, true);
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return [];
  }
};
