// deno-lint-ignore-file camelcase no-explicit-any
import { ky, urlJoin } from "./deps.ts";
import {
  GetUploadFileUrlRequest,
  GetUploadFileUrlResponse,
  NotionResponse,
  Operation,
} from "./type.ts";
import { API_BASE_URL } from "./constant.ts";
import { log } from "../src/util/util.ts";
import { getContentTypeFromExtension, requestNotion } from "./util.ts";

const endpoint = {
  loadUserContent: "loadUserContent",
  loadPageChunk: "loadPageChunk",
  getUploadFileUrl: "getUploadFileUrl",
  submitTransaction: "submitTransaction",
};

/**
 * Notionの非公式クライアント
 */
export class NotionUnofficialClient {
  private token_v2: string;

  constructor({ token_v2 }: { token_v2: string }) {
    this.token_v2 = token_v2;
  }

  /**
   * post data to endpoint
   *
   * @param {string} endpoint エンドポイント
   * @param {object} data bodyに詰め込むデータ。JSONとして送信される
   */
  private async post(endpoint: string, data: object): Promise<Response> {
    const url = urlJoin(API_BASE_URL, endpoint);
    log.debug(`post: ${url}`);
    log.debug(data);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          cookie: `token_v2=${this.token_v2}`,
        },
      });

      if (!(response as Response).ok) {
        throw new Error((response as Response).statusText);
      }

      return response;
    } catch (e: unknown) {
      const error = e as Error;
      throw new Error(error.message);
    }
  }

  /**
   * 汎用的なリクエスト送信
   */
  private async sendRequest(request: Request) {
    request.headers.set("cookie", `token_v2=${this.token_v2}`);

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response;
  }

  async loadUserContent() {
    try {
      const data: Response = await this.post(endpoint.loadUserContent, {});
      const json = data.json();
      return json;
    } catch (e: unknown) {
      const error = e as Error;
      console.error(error.message);
    }
  }

  async getPageById(pageId: string): Promise<NotionResponse> {
    const response: NotionResponse = await requestNotion({
      endpoint: endpoint.loadPageChunk,
      creds: { token: this.token_v2 },
      body: { pageId },
    });
    return response;
  }

  /**
   * 画像アップロード用のリンクを生成
   */
  async getUploadFileUrl(
    fileName: string,
    contentType: string,
  ): Promise<GetUploadFileUrlResponse> {
    const request: GetUploadFileUrlRequest = {
      bucket: "secure",
      name: fileName,
      contentType,
    };

    try {
      const res: Response = await this.post(
        endpoint.getUploadFileUrl,
        request,
      );
      const json = res.json();
      return json;
    } catch (e: unknown) {
      const error = e as Error;
      throw new Error(error.message);
    }
  }

  /**
   * 画像をアップロード
   */
  async uploadFile(fileName: string, ext: string) {
    try {
      const imageFile = await Deno.readFile(fileName);
      const contentType = getContentTypeFromExtension(ext);

      // 1. getUploadFileUrl
      const { url, signedPutUrl } = await this.getUploadFileUrl(
        "github.png",
        contentType,
      );

      // urlからfileIdを切り出す
      const fileId = new URL(url).pathname.split("/")[2];

      // 2. Upload file to S3 - PUT
      const request = new Request(signedPutUrl, {
        method: "PUT",
        body: imageFile,
        headers: {
          "Content-Type": contentType,
        },
      });
      await this.sendRequest(request);

      return { fileId, fileUrl: url };
    } catch (e: unknown) {
      const error = e as Error;
      throw error;
    }
  }

  async submitTransaction(operations: Operation[]) {
    await this.post(endpoint.submitTransaction, { operations });
  }
}
