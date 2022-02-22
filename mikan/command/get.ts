import { Api } from "@/api.ts";
import { NOTION_ROOT_PARENT_ID } from "@/constant.ts";
import { Command } from "@/deps.ts";
import { echoFinish, echoHeader, log } from "@/util/util.ts";
import { apiServiceCollection } from "@/di/serviceCollection.ts";

const api = apiServiceCollection.get(Api);

export const get = new Command()
  .name("get")
  .arguments("<target:string>")
  .description("get block info")
  .action(async (_options: any, target: string) => {
    echoHeader("mikan get block");
    switch (target) {
      case "block":
        await api.getBlock(NOTION_ROOT_PARENT_ID);
        break;
      case "childBlock":
        await api.getChildBlock(NOTION_ROOT_PARENT_ID);
        break;
      default:
        log.warn("ターゲットを選択してください");
    }
    echoFinish();
  });
