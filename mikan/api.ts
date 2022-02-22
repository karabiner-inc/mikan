import { NOTION_ROOT_PARENT_ID } from "./constant.ts";
import { types } from "@/di/types.ts";
import { Client, Inject, Service } from "./deps.ts";
import { PageInfo } from "./type/PageInfo.ts";
import { log, sleep } from "./util/util.ts";

@Service()
export class Api {
  constructor(@Inject(types.client) private client: Client) {}

  // ページ内のブロックを取得
  async getBlock(blockId: string) {
    await sleep();
    try {
      const response = await this.client.blocks.retrieve({
        block_id: blockId,
      });
      console.log(response);
    } catch (error: any) {
      log.error(error?.body);
      return false;
    }
  }

  async getChildBlock(blockId: string) {
    await sleep();
    try {
      const response = await this.client.blocks.children.list({
        block_id: blockId,
      });
      log.debug(response);
    } catch (error: any) {
      log.error(error?.body);
      return false;
    }
  }

  async updateBlock(blockId: string, block: { type: string; content: any }) {
    await sleep();
    try {
      console.log({
        block_id: blockId,
        [block.type]: block.content,
      });
      const response = await this.client.blocks.update({
        block_id: blockId,
        [block.type]: block.content,
      });
      console.log(response);
    } catch (error: any) {
      log.error(JSON.parse(error?.body).message);
    }
  }

  async updatePage() {}

  // ページがすでに存在するか判定
  isPageExist = async (pageId: string): Promise<boolean> => {
    try {
      await sleep();
      const { id, properties } = await this.client.pages.retrieve({
        page_id: pageId,
      });
      // log.debug({ id });
      return true;
    } catch (error: any) {
      log.error("page doesn't exist");
      log.error(error?.body);
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
      // log.debug({ id, parent });
    } catch (error: any) {
      log.error(error?.body);
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
      // log.debug({ has_more, results });
    } catch (error: any) {
      log.error(error?.body);
    }
  };

  // 空ページを追加
  addEmptyPage = async (
    title: string,
    parentPageId = NOTION_ROOT_PARENT_ID,
  ) => {
    try {
      await sleep();
      const { id, parent } = await this.client.pages.create({
        parent: { page_id: parentPageId },
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
      // log.debug({ id, parent });
      return id;
    } catch (error: any) {
      log.error(error?.body);
      return "";
    }
  };

  /**
   * ページをよしなに作成
   */
  createPage = async (
    title: string,
    parentPageId: string,
  ): Promise<PageInfo> => {
    const pageId = await this.addEmptyPage(title, parentPageId);
    return { title, pageId, parentPageId };
  };
}
