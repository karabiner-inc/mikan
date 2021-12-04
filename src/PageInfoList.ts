import { NOTION_ROOT_PARENT_ID } from "./constant.ts";
import { PageInfo } from "./type/PageInfo.ts";

interface IPageInfoList {
  addPageInfo(item: PageInfo): void;
  findByTitle(title: string): PageInfo | null;
}

export class PageInfoList implements IPageInfoList {
  private list: PageInfo[] = [
    { title: "parent", pageId: NOTION_ROOT_PARENT_ID, parentPageId: undefined },
  ];

  addPageInfo(info: PageInfo): void {
    const id = this.list.findIndex((pageInfo) => pageInfo.title === info.title);
    if (id === -1) {
      this.list.push(info);
    }
  }

  findByTitle(title: string) {
    return this.list.find((pageInfo) => pageInfo.title === title) ?? null;
  }
}
