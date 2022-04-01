export const existsFile = async (filePath: string) => {
  try {
    await Deno.stat(filePath);
    return true;
  } catch (_e) {
    return false;
  }
};

/**
 * convert string to json
 * if passed invalid string, return empty array
 */
const parseJson = (jsonString: string) => {
  try {
    return JSON.parse(jsonString) as { file: string; type: string[] }[];
  } catch (_e) {
    return [];
  }
};

/**
 * ログファイルの出力
 * format:
 * [
 *   {
 *     "file": string,
 *     "type": string[],
 *   }
 * ]
 */
export const log = (
  { fileName, type }: { fileName: string | undefined; type: string },
) => {
  if (fileName === undefined) {
    fileName = "stdin";
  }

  // 1. open output file
  const filePath = "./output.json";
  const file = Deno.openSync(filePath, { write: true, create: true });

  // 2. read output file
  const text = Deno.readTextFileSync(filePath);

  // 3. write log message
  let message = "";
  if (text === "") {
    message = JSON.stringify(
      [
        {
          file: fileName,
          type: [type],
        },
      ],
      null,
      2,
    );
  } else {
    const oldMessage = parseJson(text);
    const index = oldMessage.findIndex(({ file }) => file === fileName);
    if (index !== -1) {
      oldMessage[index].type.push(type);
    } else {
      oldMessage.push({ file: fileName, type: [type] });
    }
    message = JSON.stringify(oldMessage, null, 2);
  }
  Deno.writeTextFileSync(filePath, message);

  // 4. release resource
  file.close();
};

/**
 * return true if str has iframe tag
 */
export const hasIframe = (htmlString: string): boolean => {
  return htmlString.search(/<iframe/) !== -1;
};
