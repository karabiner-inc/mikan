import { Api } from "../api.ts";
import { Command } from "../deps.ts";
import { echoFinish, echoHeader, log } from "../util/util.ts";
import { apiServiceCollection } from "../di/serviceCollection.ts";
// import { NOTION_ROOT_PARENT_ID } from "../constant.ts";

const api = apiServiceCollection.get(Api);

export const update = new Command()
  .name("update")
  .arguments("<target:string>")
  .description("update")
  .action(async (_options: any, target: string) => {
    echoHeader("mikan get block");
    switch (target) {
      case "page":
        await api.updatePage();
        break;
      case "block":
        break;
      default:
        log.warn("ターゲットを選択してください");
    }
    echoFinish();
  });
