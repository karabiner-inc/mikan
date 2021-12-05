import { Api } from "@/api.ts";
import { NOTION_ROOT_PARENT_ID } from "@/constant.ts";
import { AsyncRay, Kia, basename } from "@/deps.ts";
import { PageInfoList } from "@/PageInfoList.ts";
import { apiServiceCollection } from "@/di/serviceCollection.ts";
import { Command } from "@/type/Command.ts";
import {
  getFileTitle,
  readDirRecursively,
  getBlocksFromMarkdown,
  echoHeader,
  echoFinish,
} from "@/util/util.ts";

const rootDirectory = "./md";
let parentPageId = NOTION_ROOT_PARENT_ID;
const pageInfoList = new PageInfoList();
const filePathList = readDirRecursively(rootDirectory);
const api = apiServiceCollection.get(Api);
const kia = new Kia("motion");

const createEmptyNotionPage = async (path: string): Promise<void> => {
  const title = basename(path);
  const pageInfo = pageInfoList.findByTitle(title);
  if (!pageInfo) {
    const newPageInfo = await api.createPage(title, parentPageId);
    pageInfoList.addPageInfo(newPageInfo);
    parentPageId = newPageInfo ? newPageInfo.pageId : parentPageId;
  } else {
    parentPageId = pageInfo ? pageInfo.pageId : parentPageId;
  }
};

// 作成したページにコンテンツを埋め込む
const addContent = async (filePath: string): Promise<void> => {
  const title = getFileTitle(filePath);
  const pageId = title && pageInfoList.findByTitle(title)?.pageId;
  const blocks = getBlocksFromMarkdown(filePath);
  pageId ? await api.appendChildrenBlock(pageId, blocks) : false;
};

//   mdディレクトリからNotionページを生成;
const createNotionPageFromMdDir = async (filePath: string): Promise<void> => {
  const list = filePath.split("/");
  //   ルートページまたはページがまだなければ新規作成
  await AsyncRay(list.slice(2, list.length)).aForEach(async (str: string) => {
    await kia.start();
    await kia.set({ text: `creating ${str}`, indent: 2 });
    await createEmptyNotionPage(str);
  });
  // コンテンツの追加
  await addContent(filePath);
  await kia.succeed(`created ${filePath}`);
};

export const motion: Command = {
  name: "motion",
  desc: "import md to Notion",
  action: async (options: any) => {
    echoHeader("mikan motion");
    await AsyncRay(filePathList).aForEach(async (filePath: string) => {
      await createNotionPageFromMdDir(filePath);
    });
    echoFinish();
  },
};
