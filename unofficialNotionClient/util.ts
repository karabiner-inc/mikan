import { urlJoin } from "./deps.ts";
import { NotionRequest, NotionResponse } from "./type.ts";
import { API_BASE_URL } from "./constant.ts";

export const convertDashId = (id: string) => {
  const dashId = `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${
    id.slice(16, 20)
  }-${id.slice(20)}`;
  return dashId;
};

const getAllBlocks = async ({
  url,
  token,
  limit,
  stack,
  chunkNumber,
  res,
  resolve,
  reject,
  body,
}: NotionRequest) => {
  return await fetch(url, {
    headers: {
      accept: "*/*",
      "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/json",
      cookie: `token_v2=${token};`,
    },
    body: JSON.stringify({
      cursor: { stack },
      chunkNumber,
      ...body,
      limit,
      verticalColumns: false,
    }),
    method: "POST",
  })
    .then((response) => {
      return response.json();
    })
    .then((r) => {
      if (((r.cursor || {}).stack || {}).length) {
        getAllBlocks({
          url,
          token,
          limit,
          stack: r.cursor.stack,
          chunkNumber: chunkNumber + 1,
          res: {
            recordMap: {
              block: {
                ...res.recordMap.block,
                ...r.recordMap.block,
              },
            },
          },
          resolve,
          reject,
          body,
        });
      } else {
        if (r.errorId) {
          reject(r);
        }
        const ret: NotionResponse = {
          recordMap: {
            block: {
              ...res.recordMap.block,
              ...(r.recordMap || {}).block,
            },
          },
        };
        resolve(ret);
      }
    })
    .catch((error: Error) => console.error(error));
};

export const requestNotion = ({
  endpoint,
  creds: { token },
  body,
}: {
  endpoint: string;
  creds: { token: string };
  body?: { limit?: number; pageId: string };
}): Promise<NotionResponse> => {
  return new Promise((resolve, reject) => {
    getAllBlocks({
      url: urlJoin(API_BASE_URL, endpoint),
      token,
      limit: (body || { limit: 50 }).limit || 50,
      stack: [],
      chunkNumber: 0,
      res: {
        recordMap: { block: {} },
      },
      resolve,
      reject,
      body,
    });
  });
};

/**
 * 対応形式: jpeg/jpg/png/gif/svg
 * @param ext extension
 */
export const getContentTypeFromExtension = (ext: string): string => {
  switch (ext) {
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
  }
  throw new Error("不正な拡張子です");
};
