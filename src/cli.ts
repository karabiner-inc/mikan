import { NOTION_ROOT_PARENT_ID } from "./constant.ts";
import {
  martian,
  Kia,
  Command,
  colors,
  HelpCommand,
  CompletionsCommand,
} from "./deps.ts";
import { log } from "./utils/logger.ts";
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const name = "mikan";
const description = `
マークダウンファイルをNotionに送信し新しいページとして挿入します
`;
const version = "0.0.1";

await new Command()
  .stopEarly()
  .name(name)
  .version(version)
  .description(description)
  .env("NOTION_API_KEY=<value:string>", "Notion API key")
  .env("NOTION_ROOT_PARENT_ID=<value:string>", "Notion page id")
  .env("NOTION_DATABASE_ID=<value:string>", "Notion database id")
  .example(
    `${name} motion`,
    `search md file from ${colors.bold.green("./md")}
    and call Notion API`
  )
  .arguments("<command> [subcommand] [option]")
  .command("motion", "import md to Notion")
  .action(async (options: any) => {
    const kia = new Kia("spinner");
    log.debug("hello world");
    log.debug(options);
    log.info(`root parent id: ${NOTION_ROOT_PARENT_ID}`);
    kia.start();
    await sleep(3000);
    kia.succeed("finished");
    const blocks = martian.markdownToBlocks(`
## this is heading 2
* [ ] todo
`);
    console.dir(blocks, { depth: Number.MAX_SAFE_INTEGER });
  })
  .option("-d, --directory [directory:string]", "directory store markdown file")
  .command("help", new HelpCommand().global())
  .command("completions", new CompletionsCommand())
  .parse(Deno.args);
