import { NotionFormat, Operation } from "./type.ts";

const Command = {
  set: "set",
  update: "update",
  listAfter: "listAfter",
  listRemove: "listRemove",
};

export const buildOp = (
  id: string,
  { command, path, args }: { command: string; path: string[]; args: any },
): Operation => {
  return {
    id,
    table: "block",
    path,
    command,
    args,
  };
};

export const updatePropertiesOp = (id: string, source: string): Operation => {
  return buildOp(id, {
    command: Command.update,
    path: ["properties"],
    args: { source: [[source]] },
  });
};

export const updateFormatOp = (id: string, format: {}): Operation => {
  return buildOp(id, {
    command: Command.update,
    path: ["format"],
    args: format,
  });
};

export const listAfterFileIdsOp = (id: string, fileId: string): Operation => {
  return buildOp(id, {
    command: Command.listAfter,
    path: ["file_ids"],
    args: { id: fileId },
  });
};

export const updateOp = (id: string, param: any) => {
  return buildOp(id, {
    command: Command.update,
    path: [],
    args: param,
  });
};

export const embeddedFileOps = (
  id: string,
  { fileId, fileUrl }: { fileId: string; fileUrl: string },
): Operation[] => {
  const format: NotionFormat = {
    display_source: fileUrl,
  };
  return [
    updatePropertiesOp(id, fileUrl),
    updateFormatOp(id, format),
    listAfterFileIdsOp(id, fileId),
  ];
};

export const updateEmbeddedFileOps = (
  id: string,
  {
    userId,
    fileId,
    fileUrl,
  }: {
    userId: string;
    fileId: string;
    fileUrl: string;
  },
): Operation[] => {
  const lastEditedData = {
    last_edited_time: new Date().getTime,
    last_edited_by: userId,
  };
  const ops = embeddedFileOps(id, { fileId, fileUrl });
  ops.push(updateOp(id, lastEditedData));
  return ops;
};
