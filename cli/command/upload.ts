import { extname, parse } from "../../deps.ts";
import { AsyncRay, Chain, Command, Kia } from "../deps.ts";
import { Api } from "../api.ts";
import { NOTION_ROOT_PARENT_ID, TOKEN_V2, USER_ID } from "../constant.ts";
import { PageInfoList } from "../PageInfoList.ts";
import { PageInfo } from "../type/PageInfo.ts";
import {
  convertMarkdownToNotionBlock,
  echoFinish,
  echoHeader,
  getFileTitle,
  readDirRecursively,
  sleep,
} from "../util/util.ts";
import { NotionUnofficialClient } from "../../unofficialNotionClient/unofficialNotionClient.ts";
import { updateEmbeddedFileOps } from "../../unofficialNotionClient/operation.ts";

const pageInfoList: PageInfoList = new PageInfoList();

const api = new Api();
const spinner = new Kia();

export const upload = new Command()
  .name("upload")
  .description("import md to Notion")
  .arguments("<directory>")
  .action(async (_, directory: string) => {
    const filePathList = readDirRecursively(directory);
    echoHeader("mikan motion");
    await AsyncRay(filePathList).aForEach(createNotionPage);
    echoFinish();
    // const users = await api.getPersonUsers();
    // console.dir(users, { depth: 10 });
  });

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

/** 画像アップロード */
const uploadImageToBlock = async (imagePath: string, blockId: string) => {
  const userId = USER_ID;
  if (userId === undefined || userId === "") {
    throw new Error("USER_IDの値が不正です");
  }
  const client = new NotionUnofficialClient({ token_v2: TOKEN_V2 });

  try {
    await sleep();
    const { fileId, fileUrl } = await client.uploadFile(
      imagePath,
      extname(imagePath).slice(1),
    );

    // await sleep();
    const ops = updateEmbeddedFileOps(blockId, {
      userId,
      fileId,
      fileUrl,
    });

    // await sleep();
    await client.submitTransaction(ops);
  } catch (e: unknown) {
    const error = e as Error;
    console.error(error.message);
    throw error;
  }
};

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
  responce?.forEach((block) => {
    if (block.type === "image" && block.image.type === "external") {
      // 画像ファイルへの参照
      if (frontmatter.valid && frontmatter.value) {
        const path = parse(mdFilePath);
        Chain(frontmatter.value).aForEach(async (attachment) => {
          if (attachment.url === block.image.external.url) {
            // console.log(
            //   `upload ${path.dir}/${path.name}_添付/${attachment.fileName}`,
            // );
            await uploadImageToBlock(
              `${path.dir}/${path.name}_添付/${attachment.fileName}`,
              block.id,
            );
          }
        });
      }
    }
  });
};

/**
 * パスを分解したのち最初の2つの要素を取り除いた配列を返す
 *
 * ./md/path/to/file.md => [path,to,file.md]
 * @param path
 * @returns 分解したパスの配列
 */
const splitPath = (path: string): string[] => {
  return path.split("/").slice(2);
};
