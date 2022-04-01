import { colors, Command, CompletionsCommand, HelpCommand } from "./deps.ts";
import { upload } from "./command/upload.ts";
import { get } from "./command/get.ts";
import { update } from "./command/update.ts";

const name = "mikan";
const description = `
マークダウンファイルをNotionに送信し新しいページとして挿入します
`;
const version = "0.0.1";
const example = {
  title: "upload markdown to Notion",
  contents: `${colors.bold("$ mikan upload ./md")}`,
};

await new Command()
  .stopEarly()
  .name(name)
  .version(version)
  .description(description)
  .example(example.title, example.contents)
  .env("NOTION_API_KEY=<value:string>", "Notion API key")
  .env("NOTION_ROOT_PARENT_ID=<value:string>", "Notion page id")
  .command(upload.getName(), upload)
  .command(get.getName(), get)
  .command(update.getName(), update)
  .command("help", new HelpCommand().global())
  .command("completions", new CompletionsCommand())
  .parse(Deno.args);
