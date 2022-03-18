import { parse } from "../../deps.ts";
import { AsyncRay, Command, Kia } from "../deps.ts";
import { Api } from "../api.ts";
import { NOTION_ROOT_PARENT_ID } from "../constant.ts";
import { PageInfoList } from "../PageInfoList.ts";
import { apiServiceCollection } from "../di/serviceCollection.ts";
import { PageInfo } from "../type/PageInfo.ts";
import {
  convertMarkdownToNotionBlock,
  echoFinish,
  echoHeader,
  getFileTitle,
  log,
  readDirRecursively,
} from "../util/util.ts";

const rootDirectory = "./md";
const filePathList = readDirRecursively(rootDirectory);
const pageInfoList = new PageInfoList();

const api = apiServiceCollection.get(Api);
const spinner = new Kia();

const createEmptyNotionPage = async (
  path: string,
  parentPageId: string,
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
  // await spinner.start();
  const spinnerText = `add contents: ${parse(path).base}`;
  spinner.start();
  spinner.set({ text: spinnerText, indent: 4 });
  const blocks = await convertMarkdownToNotionBlock(path);
  await api.appendChildrenBlock(pageId, blocks);
  spinner.stop();
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
  // await spinner.start();
  let parentPageId = NOTION_ROOT_PARENT_ID;

  // ルートページであれば新規作成|ページがまだなければ新規作成
  await AsyncRay(splitPath(path)).aForEach(async (str: string) => {
    const spinnerText = `creating ${str}`;
    spinner.start();
    spinner.set({ text: spinnerText, indent: 2 });
    const pageInfo = await createEmptyNotionPage(str, parentPageId);
    parentPageId = pageInfo.pageId;
  });
  spinner.succeed(`created ${path}`);

  // コンテンツの追加
  const pageId = parentPageId;
  await addContent(path, pageId);
};

export const motion = new Command()
  .name("motion")
  .description("import md to Notion")
  .action(async (_options: any) => {
    echoHeader("mikan motion");
    await AsyncRay(filePathList).aForEach(createNotionPage);
    echoFinish();
  });
