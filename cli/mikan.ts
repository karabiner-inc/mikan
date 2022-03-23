import { colors, Command, CompletionsCommand, HelpCommand } from "./deps.ts";
import { UploadCommand } from "./command/upload.ts";
import { get } from "./command/get.ts";
import { update } from "./command/update.ts";

const name = "mikan";
const description = `
マークダウンファイルをNotionに送信し新しいページとして挿入します
`;
const version = "0.0.1";
const example = {
  title: "move your-knowledge to Notion",
  contents: `${colors.bgBlack.bold("$ mikan move")}
search md file from ${colors.bold.green("./md")} and call Notion API`,
};

await new Command()
  .stopEarly()
  .name(name)
  .version(version)
  .description(description)
  .env("NOTION_API_KEY=<value:string>", "Notion API key")
  .env("NOTION_ROOT_PARENT_ID=<value:string>", "Notion page id")
  .env("NOTION_DATABASE_ID=<value:string>", "Notion database id")
  .example(example.title, example.contents)
  .arguments("<command> [option]")
  .command("upload", new UploadCommand())
  .command(get.getName(), get)
  .command(update.getName(), update)
  .option("-d, --directory [directory:string]", "directory store markdown file")
  .command("help", new HelpCommand().global())
  .command("completions", new CompletionsCommand())
  .parse(Deno.args);
