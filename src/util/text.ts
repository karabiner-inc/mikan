/**
 * get file title from filePath
 * # Example
 * ```
 * getFileTitle("/path/to/hoge.txt");
 * // => hoge
 * ```
 * @param filePath
 * @returns file title
 */
export const getFileTitle = (filePath: string): string | undefined => {
  return filePath
    .split("/")
    .at(-1)
    ?.replace(/\.[^/.]+$/, "");
};
