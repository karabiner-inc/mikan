export type GetUploadFileUrlRequest = {
  bucket: string;
  contentType: string;
  name: string;
};

export type GetUploadFileUrlResponse = {
  url: string;
  signedGetUrl: string;
  signedPutUrl: string;
  fileId: string;
  rawJson?: unknown;
};

export type NotionId = {
  dashId: string;
  noDasahId: string;
};

export type Page = {
  id: string;
  notionId: NotionId;
  blockRecords: [];
  userRecords: [];
};

export type Operation = {
  id: string;
  table: string;
  path: string[];
  command: string;
  args: object;
};

export type NotionObject = {
  id: string;
  type:
    | "page"
    | "embed"
    | "image"
    | "text"
    | "header"
    | "sub_header"
    | "sub_sub_header"
    | "divider"
    | "break"
    | "numbered_list"
    | "bulleted_list";
  properties: {
    source?: string[][];
    title?: string[][];
  };
  format: {
    page_icon: string;
    page_cover: string;
    page_cover_position: number;
    block_color: string;
  };
  content: string[];
  created_time: number;
  last_edited_time: number;
};

export type NotionResponse = {
  readonly recordMap: {
    block: { [blockId: string]: { value: NotionObject } };
  };
};

export type NotionRequest = {
  url: string;
  token: string;
  limit: number;
  stack: Array<any>;
  chunkNumber: number;
  res: { recordMap: { block: object } };
  resolve: Function;
  reject: Function;
  body?: object;
};

export type NotionFormat = {
  block_full_width?: boolean;
  block_height?: number;
  block_page_witdh?: boolean;
  block_preserve_scale?: boolean;
  block_width?: number;
  block_aspect_ratio?: number;
  display_source?: string;
};

// Notionが1つのページを表現するためのオブジェクト
export type RecordMap = {
  block: {
    [key: string]: {
      role: "editor";
      value: {
        alive: boolean;
        content?: string[];
        created_by_id: string;
        created_by_table: "bot" | "notion_user";
        created_time: number;
        file_ids?: string[];
        // format?: {
        // block_height?: number;
        // block_width?: number;
        // block_aspect_ratio?: number;
        // block_full_width?: false;
        // block_page_witdh?: boolean;
        // block_preserve_scale?: boolean;
        // display_source?: string;
        // };
        id: string;
        last_edited_by_id: string;
        last_edited_by_table: string;
        last_edited_time: string;
        parent_id: string;
        parent_table: "block";
        permissions?: object[];
        properties: {
          size?: string[][];
          source?: string[][];
          title?: string[][];
        };
        space_id: string;
        type: "image" | "figma" | "page" | "text";
        version: number;
      };
    };
  };
};
