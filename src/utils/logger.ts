import { colors, stdout, emojify } from "../deps.ts";
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

export const log = {
  // deno-lint-ignore no-explicit-any
  debug(msg: any) {
    const prefix = logColor.debug.bold("ﴫ [DEBUG] ");
    if (DEBUG_MODE) {
      stdout.write(`${emoji.debug} ${prefix}`);
      if (isString(msg)) {
        console.log(logColor.debug(msg));
      } else {
        stdout.write("\n");
        console.dir(msg, { depth: Number.MAX_SAFE_INTEGER });
      }
    }
  },
  // deno-lint-ignore no-explicit-any
  info(msg: any) {
    const prefix = logColor.info.bold(" [INFO] ");
    stdout.write(`${emoji.info} ${prefix}`);
    if (isString(msg)) {
      console.log(logColor.info(msg));
    } else {
      stdout.write("\n");
      console.dir(msg, { depth: Number.MAX_SAFE_INTEGER });
    }
  },
  warn(msg: string) {
    console.log(emoji.warn, logColor.warn.bold(" [WARN]"), logColor.warn(msg));
  },
  error(msg: string) {
    console.log(
      emoji.error,
      logColor.error.bold(" [ERROR]"),
      logColor.error(msg)
    );
  },
  critical(msg: string) {
    console.log(
      emoji.critical,
      logColor.critical.bold(" [CRITICAL]"),
      logColor.critical(msg)
    );
  },
};
