import { basename, dirname, ensureFile, parse } from "../../deps.ts";
import { AsyncRay, Command, Kia } from "../deps.ts";
import { Api } from "../api.ts";
import { NOTION_ROOT_PARENT_ID } from "../constant.ts";
import { PageInfoList } from "../PageInfoList.ts";
import { PageInfo } from "../type/PageInfo.ts";
import {
  convertMarkdownToNotionBlock,
  echoFinish,
  echoHeader,
  getFileTitle,
  readDirRecursively,
} from "../util/util.ts";
// import { Chain } from "https://deno.land/x/async_ray@3.2.1/mod.ts";

const rootDirectory = "./cli/test/md";
const filePathList = readDirRecursively(rootDirectory);
const pageInfoList = new PageInfoList();

const api = new Api();
const spinner = new Kia();

/** ファイルパスからタイトルを取得しそのページを生成する */
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
 * @param mdFilePath パス
 * @param pageId ページID
 */
const addContent = async (
  mdFilePath: string,
  pageId: string,
): Promise<void> => {
  const { blocks, frontmatter } = await convertMarkdownToNotionBlock(
    mdFilePath,
  );
  const responce = await api.appendChildrenBlock(pageId, blocks);
  // 画像ファイルへの参照
  // if (frontmatter.valid && frontmatter.value) {
  //   const path = parse(mdFilePath);
  //   Chain(frontmatter.value).aForEach(async (attachment) => {
  //     const { isFile } = await Deno.stat(
  //       `${path.dir}/${path.name}_添付/${attachment.fileName}`,
  //     );
  //     console.log(
  //       isFile
  //         ? `${path.dir}/${path.name}_添付/${attachment.fileName} exist`
  //         : "error!!",
  //     );
  //   });
  // }
};

/** 画像アップロード */
const uploadImageToBlock = async (imagePath: string, blockId: string) => {
  console.log(`upload ${imagePath} to ${blockId}`); // const userId = "0ca08d86-a80a-4c82-8f28-3952e3758739";
  // const client = new NotionUnofficialClient({ token_v2: TOKEN_V2 });
  //
  // try {
  //   const { fileId, fileUrl } = await client.uploadFile(
  //     imagePath,
  //     extname(imagePath).slice(1),
  //   );
  //
  //   const ops = updateEmbeddedFileOps(blockId, {
  //     userId,
  //     fileId,
  //     fileUrl,
  //   });
  //   await client.submitTransaction(ops);
  // } catch (e: unknown) {
  //   const error = e as Error;
  //   throw error;
  // }
};

/**
 * パスを分解したのち最初の2つの要素を取り除いた配列を返す
 * ./md/path/to/file.md => [path,to,file.md]
 * @param path
 * @returns 分解したパスの配列
 */
const splitPath = (path: string): string[] => {
  return path.split("/").slice(4);
};

/**
 * ディレクトリからNotionページを生成
 * @param path ディレクトリパス
 */
const createNotionPage = async (path: string): Promise<void> => {
  let parentPageId = NOTION_ROOT_PARENT_ID;

  // ルートページであれば新規作成|ページがまだなければ新規作成
  await AsyncRay(splitPath(path)).aForEach(async (str: string) => {
    const spinnerText = `creating ${str}`;
    spinner.start();
    spinner.set({ text: spinnerText, indent: 2 });

    // create page
    const pageInfo = await createEmptyNotionPage(str, parentPageId);

    // update parent page id
    parentPageId = pageInfo.pageId;
  });
  spinner.succeed(`created ${path}`);

  // add content
  const pageId = parentPageId;
  const spinnerText = `add contents: ${parse(path).base}`;
  spinner.start();
  spinner.set({ text: spinnerText, indent: 4 });
  await addContent(path, pageId);
  spinner.stop();
};

export const upload = new Command()
  .name("upload")
  .description("import md to Notion")
  .action(async (_) => {
    echoHeader("mikan motion");
    await AsyncRay(filePathList).aForEach(createNotionPage);
    echoFinish();
  });
