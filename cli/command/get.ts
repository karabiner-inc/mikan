import { Api } from "../api.ts";
import { NOTION_ROOT_PARENT_ID } from "../constant.ts";
import { Command } from "../deps.ts";
import { echoFinish, echoHeader, log } from "../util/util.ts";

const api = new Api();

export const get = new Command()
  .name("get")
  .arguments("<target:string> <id:string>")
  .description("get block info")
  .action(
    async (
      _options: any,
      target: "page" | "block" | "childBlock",
      id: string,
    ) => {
      echoHeader("mikan get block");
      switch (target) {
        case "page":
          const pageProp = await api.getPage(id);
          log.debug(pageProp);
          break;
        case "block":
          await api.getBlock(id);
          break;
        case "childBlock":
          await api.getChildBlock(id);
          break;
        default:
          log.warn("ターゲットを選択してください");
      }
      echoFinish();
    },
  );
