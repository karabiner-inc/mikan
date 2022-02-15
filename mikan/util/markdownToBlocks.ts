import { martian } from "@/deps.ts";
type GetBlocksFromMarkdown = {
  (filePath: string): any[];
};

export const convertBlocksFromMarkdown: GetBlocksFromMarkdown = (filePath) => {
  const decoder = new TextDecoder("utf-8");
  const content = Deno.readFileSync(filePath);
  return martian.markdownToBlocks(decoder.decode(content));
};
