import { colors, emojify } from "../deps.ts";
import { DEBUG_MODE } from "../constant.ts";
import { isString } from "./type.ts";

const logColor = {
  debug: colors.dim,
  info: colors.cyan,
  warn: colors.yellow,
  error: colors.magenta,
  critical: colors.red,
};

const emoji = {
  debug: emojify(":bug:"),
  info: emojify(":bell:"),
  warn: emojify(":thumbsdown:"),
  error: emojify(":heavy_exclamation_mark:"),
  critical: emojify(":boom:"),
};

/**
 * 標準出力にメッセージを表示する
 * @param msg 表示する文言
 */
const writeStdout = (msg: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(msg);
  Deno.writeSync(Deno.stdout.rid, data);
};

export const log = {
  // deno-lint-ignore no-explicit-any
  debug(msg: any) {
    const prefix = logColor.debug.bold("[DEBUG] ");
    if (DEBUG_MODE) {
      writeStdout(`${emoji.debug} ${prefix}`);
      if (isString(msg)) {
        console.log(logColor.debug(msg));
      } else {
        writeStdout("\n");
        console.dir(msg, { depth: Number.MAX_SAFE_INTEGER });
      }
    }
  },
  // deno-lint-ignore no-explicit-any
  info(msg: any) {
    const prefix = logColor.info.bold("[INFO] ");
    writeStdout(`${emoji.info} ${prefix}`);
    if (isString(msg)) {
      console.log(logColor.info(msg));
    } else {
      writeStdout("\n");
      console.dir(msg, { depth: Number.MAX_SAFE_INTEGER });
    }
  },
  warn(msg: string) {
    console.log(emoji.warn, logColor.warn.bold("[WARN]"), logColor.warn(msg));
  },
  error(msg: string) {
    console.log(
      emoji.error,
      logColor.error.bold("[ERROR]"),
      logColor.error(msg),
    );
    exportMessageToLogFile(msg);
  },
  critical(msg: string) {
    console.log(
      emoji.critical,
      logColor.critical.bold("[CRITICAL]"),
      logColor.critical(msg),
    );
  },
};

const exportMessageToLogFile = (message: string) => {
  Deno.writeTextFileSync(
    "./error.log",
    message + "\n",
    {
      append: true,
      create: true,
    },
  );
};
