export * from "./fs.ts";
export * from "./logger.ts";
export * from "./sleep.ts";
export * from "./text.ts";
export * from "./type.ts";
export * from "./markdownToBlocks.ts";

import { ansi, colors, emojify } from "@/deps.ts";

export const echoHeader = (text: string) => {
  const header = `| ${text} |`;
  const bar = header.replaceAll(/./gi, "-");
  const indent = 2;
  console.log(ansi.clearScreen());
  console.log(ansi.cursorForward(indent).toString(), colors.blue.bold(bar));
  console.log(ansi.cursorForward(indent).toString(), colors.blue.bold(header));
  console.log(ansi.cursorForward(indent).toString(), colors.blue.bold(bar));
  console.log();
};

export const echoFinish = () => {
  console.log(
    ansi.cursorNextLine().toString(),
    ansi.cursorForward(2).toString(),
    emojify(":tada:"),
    colors.blue.bold("finish")
  );
};
