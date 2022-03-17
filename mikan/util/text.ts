import { parse } from "../deps.ts";

/**
 * get file title from filePath
 * ```
 * getFileTitle("/path/to/hoge.txt");
 * // => hoge
 * ```
 * @param filePath
 * @returns file title
 */
export const getFileTitle = (filePath: string): string => {
  return parse(filePath).name;
};
