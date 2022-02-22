import { NOTION_ROOT_PARENT_ID } from "./constant.ts";
import { PageInfo } from "./type/PageInfo.ts";

interface IPageInfoList {
  addPageInfo(item: PageInfo): void;
  findByTitle(title: string, parentPageId: string): PageInfo | undefined;
}

export class PageInfoList implements IPageInfoList {
  private list: PageInfo[] = [
    { title: "parent", pageId: NOTION_ROOT_PARENT_ID, parentPageId: undefined },
  ];

  addPageInfo(info: PageInfo): void {
    const id = this.list.findIndex(
      (pageInfo) =>
        pageInfo.title === info.title &&
        pageInfo.parentPageId === info.parentPageId
    );
    if (id === -1) {
      this.list.push(info);
    }
  }

  findByTitle(title: string, parentPageId: string) {
    return this.list.find(
      (pageInfo) =>
        pageInfo.title === title && pageInfo.parentPageId === parentPageId
    );
  }
}
