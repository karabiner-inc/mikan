import { DEBUG_MODE, NOTION_ROOT_PARENT_ID } from "./constant.ts";
import { types } from "@/di/types.ts";
import { Client, Inject, Service } from "./deps.ts";
import { PageInfo } from "./type/PageInfo.ts";
import { sleep, log } from "./util/util.ts";

@Service()
export class Api {
  constructor(@Inject(types.client) private client: Client) {}
  // ページがすでに存在するか判定
  isPageExist = async (pageId: string): Promise<boolean> => {
    try {
      await sleep();
      const { id, properties } = await this.client.pages.retrieve({
        page_id: pageId,
      });
      log.debug({ id });
      return true;
    } catch (error: any) {
      console.error("page doesn't exist");
      console.error(error?.body);
      return false;
    }
  };

  // 新規ページの追加
  addPage = async (blocks: any[]) => {
    const title = "sample";
    try {
      await sleep();
      const { id, parent } = await this.client.pages.create({
        parent: { page_id: NOTION_ROOT_PARENT_ID },
        properties: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        children: blocks,
      });
      log.debug({ id, parent });
    } catch (error: any) {
      console.clear();
      console.error(error?.body);
    }
  };

  // ページやブロックにコンテンツを追加
  appendChildrenBlock = async (block_id: string, contents: any[]) => {
    try {
      await sleep();
      const { has_more, results } = await this.client.blocks.children.append({
        block_id,
        children: contents,
      });
      log.debug({ has_more, results });
    } catch (error: any) {
      console.clear();
      console.error(error?.body);
    }
  };

  // 空ページを追加
  addEmptyPage = async (title: string, pageId = NOTION_ROOT_PARENT_ID) => {
    try {
      await sleep();
      const { id, parent } = await this.client.pages.create({
        parent: { page_id: pageId },
        properties: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        children: [],
      });
      log.debug({ id, parent });
      return id;
    } catch (error: any) {
      console.clear();
      console.error(error?.body);
      return "";
    }
  };

  /**
   * ページをよしなに作成
   * */
  createPage = async (
    title: string,
    parentPageId: string
  ): Promise<PageInfo> => {
    if (
      (await this.isPageExist(parentPageId)) &&
      parentPageId === NOTION_ROOT_PARENT_ID
    ) {
      const pageId = await this.addEmptyPage(title, NOTION_ROOT_PARENT_ID);
      return { title, pageId: pageId, parentPageId };
    } else {
      const pageId = await this.addEmptyPage(title, parentPageId);
      return { title, pageId, parentPageId };
    }
  };
  hello = () => {
    console.log("hello");
  };
}
