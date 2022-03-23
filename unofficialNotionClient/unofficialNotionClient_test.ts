import { log } from "../../src/util/logger.ts";
import { extname } from "../../deps.ts";
import { TOKEN_V2 } from "../constant.ts";
import { updateEmbeddedFileOps } from "../operation.ts";
import { NotionUnofficialClient } from "../unofficialNotionClient.ts";
import { convertDashId, getContentTypeFromExtension } from "../util.ts";
import { Operation } from "../type.ts";

Deno.test("loadUserContent", async () => {
  // 非公式クライアントのインスタンス生成
  const client = new NotionUnofficialClient({ token_v2: TOKEN_V2 });

  try {
    const res = await client.loadUserContent();
    log.debug(res.recordMap.notion_user);
  } catch (e: unknown) {
    const error = e as Error;
    log.error(error.message);
  }
});

Deno.test("getPageById", async () => {
  const pageId = "68fbbc5bde1f400ba633cece752e74d1";
  // 非公式クライアントのインスタンス生成
  const client = new NotionUnofficialClient({ token_v2: TOKEN_V2 });

  try {
    const ROOT_PAGE_ID = convertDashId(pageId);
    const rootPage = await client.getPageById(ROOT_PAGE_ID);
    for (const blockId in rootPage.recordMap.block) {
      const { value } = rootPage.recordMap.block[blockId];
      if (value.type === "embed" || value.type === "image") {
        log.debug(value);
      }
    }
  } catch (e: unknown) {
    const error = e as Error;
    log.error(error.message);
  }
});

// TODO: リソース解放を求められてテストが失敗扱いされる
/**
 * AssertionError: Test case is leaking 2 resources:
 *
 *  - A fetch response body (rid 18) was created during the test, but not consumed during the test. Consume or close the response body `ReadableStream`, e.g `await resp.text()` or `await resp.body.cancel()`.
 *  - A fetch response body (rid 21) was created during the test, but not consumed during the test. Consume or close the response body `ReadableStream`, e.g `await resp.text()` or `await resp.body.cancel()`.
 *
 *     at assert (deno:runtime/js/06_util.js:46:13)
 *     at resourceSanitizer (deno:runtime/js/40_testing.js:399:7)
 *     at async Object.exitSanitizer [as fn] (deno:runtime/js/40_testing.js:415:9)
 *     at async runTest (deno:runtime/js/40_testing.js:673:7)
 *     at async Object.runTests (deno:runtime/js/40_testing.js:786:22)
 */
Deno.test("upload image to Notion", async () => {
  const fileName = "./md/github.png";
  const userId = "0ca08d86-a80a-4c82-8f28-3952e3758739";
  const pageId = "68fbbc5bde1f400ba633cece752e74d1";

  // 非公式クライアントのインスタンス生成
  const client = new NotionUnofficialClient({ token_v2: TOKEN_V2 });

  // try {
  //   // 1. ページオブジェクトをページIDから取得
  //   const ROOT_PAGE_ID = convertDashId(pageId);
  //   const rootPage = await client.getPageById(ROOT_PAGE_ID);
  //
  //   // 2. 画像をアップロード
  //   const { fileId, fileUrl } = await client.uploadFile(
  //     fileName,
  //     extname(fileName).slice(1),
  //   );
  //   log.debug({ fileId, fileUrl });
  //
  //   // 3. アップロードした画像をブロックに紐付ける
  //   let ops: Operation[];
  //   for (const blockId in rootPage.recordMap.block) {
  //     const { value } = rootPage.recordMap.block[blockId];
  //     if (value.type === "embed" && !value.properties) {
  //       ops = updateEmbeddedFileOps(blockId, {
  //         userId,
  //         fileId,
  //         fileUrl,
  //       });
  //       await client.submitTransaction(ops);
  //       break;
  //     }
  //   }
  // } catch (e: unknown) {
  //   const error = e as Error;
  //   log.debug(error);
  // }
});
