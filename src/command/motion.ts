import { Api } from "@/api.ts";
import { NOTION_ROOT_PARENT_ID } from "@/constant.ts";
import { AsyncRay, Kia, parse } from "@/deps.ts";
import { PageInfoList } from "@/PageInfoList.ts";
import { apiServiceCollection } from "@/di/serviceCollection.ts";
import { Command } from "@/type/Command.ts";
import { PageInfo } from "@/type/PageInfo.ts";
import {
  getFileTitle,
  readDirRecursively,
  convertBlocksFromMarkdown,
  echoHeader,
  echoFinish,
  log,
} from "@/util/util.ts";

const rootDirectory = "./md";
const filePathList = readDirRecursively(rootDirectory);
const pageInfoList = new PageInfoList();

const api = apiServiceCollection.get(Api);
const kia = new Kia("motion");

const createEmptyNotionPage = async (
  path: string,
  parentPageId: string
): Promise<PageInfo> => {
  const title = getFileTitle(path);
  const pageInfo = pageInfoList.findByTitle(title, parentPageId);
  if (!pageInfo) {
    const newPageInfo = await api.createPage(title, parentPageId);
    pageInfoList.addPageInfo(newPageInfo);
    return newPageInfo;
  } else {
    return pageInfo;
  }
};

/**
 * マークダウンファイルをブロックに変換しNotionに追加する
 * @param path パス
 * @param pageId ページID
 */
const addContent = async (path: string, pageId: string): Promise<void> => {
  await kia.start();
  await kia.set({ text: `add contents: ${parse(path).base}`, indent: 4 });
  const blocks = convertBlocksFromMarkdown(path);
  await api.appendChildrenBlock(pageId, blocks);
};

/**
 * パスを分解したのち最初の2つの要素を取り除いた配列を返す
 * @param path
 * @returns 分解したパスの配列
 */
const splitPath = (path: string): string[] => {
  return path.split("/").slice(2);
};

/**
 * ディレクトリからNotionページを生成
 * @param path ディレクトリパス
 */
const createNotionPage = async (path: string): Promise<void> => {
  await kia.start();
  let parentPageId = NOTION_ROOT_PARENT_ID;

  // ルートページであれば新規作成|ページがまだなければ新規作成
  await AsyncRay(splitPath(path)).aForEach(async (str: string) => {
    await kia.set({ text: `creating ${str}`, indent: 2 });
    const pageInfo = await createEmptyNotionPage(str, parentPageId);
    parentPageId = pageInfo.pageId;
  });
  await kia.succeed(`created ${path}`);

  // コンテンツの追加
  const pageId = parentPageId;
  await addContent(path, pageId);
};

export const motion: Command = {
  name: "motion",
  desc: "import md to Notion",
  action: async (options: any) => {
    echoHeader("mikan motion");
    log.debug(options);
    await AsyncRay(filePathList).aForEach(async (filePath: string) => {
      await createNotionPage(filePath);
    });
    echoFinish();
  },
};
