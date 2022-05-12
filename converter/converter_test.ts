import { assert, assertEquals } from "../dev_deps.ts";
import { existsFile } from "./util.ts";
import { pathResolverFactory } from "../util.ts";
import { Converter } from "./converter.ts";
import { parseYamlAndProcessAttachments } from "../processor/yaml.ts";

const converter = new Converter(parseYamlAndProcessAttachments);
const resolve = pathResolverFactory(import.meta);

Deno.test("convert img-tag", async () => {
  const testMarkdown = `# title

<img src="hoge" alt="hoge">

![](hoge)

## subtitle

content
content

- list
- [ ] checkbox
- 内容
    - 自分で興味ある
        - luna
            - Kotlin, Swift
        - bravo
            - GCP
                - k8s
                - Cloud ホニャララ
    - 今ホットなやつを書く
        - Flutter
        - Rust
        - golang
        - Next.js/Nuxt.js
        - 機械学習(AI, DL)
`;
  const expectMarkdown = `# title

![hoge](hoge)

![](hoge)

## subtitle
content
content

- list
- [ ] checkbox
- 内容
    - 自分で興味ある
        - luna
            - Kotlin, Swift
        - bravo
            - GCP
                - k8s
                - Cloud ホニャララ
    - 今ホットなやつを書く
        - Flutter
        - Rust
        - golang
        - Next.js/Nuxt.js
        - 機械学習(AI, DL)
`;
  const { md } = await converter.convert({
    mdString: testMarkdown,
    fileName: "stdin",
  });
  assertEquals(
    md,
    expectMarkdown,
  );
});

Deno.test("converter.convert empty", async () => {
  const testMarkdown = "";
  const expectMarkdown = "";

  assertEquals(
    await converter.convert({ mdString: testMarkdown, fileName: "stdin" }),
    expectMarkdown,
  );
});

Deno.test("converter.convert from file", async () => {
  const expect = `# title

![hoge](hoge)

![](hoge)

## subtitle
`;
  const fileName = "./test_img.md";
  const testFilePath = resolve(fileName);
  const mdString = await Deno.readTextFile(testFilePath);
  const actual = await converter.convert({ mdString, fileName });

  assertEquals(actual, expect);
});

Deno.test("converter.convert from file with log", async () => {
  const testIframeFile = resolve("./test_iframe.md");
  const testIframe = await Deno.readTextFile(testIframeFile);
  await converter.convert({ mdString: testIframe, fileName: testIframeFile });

  const testTableFile = resolve("./test_table.md");
  const testTable = await Deno.readTextFile(testTableFile);
  await converter.convert({ mdString: testTable, fileName: testTableFile });

  existsFile("output.json")
    .then((result) => assert(result));
});

Deno.test("converter.convert from file with log", async () => {
  const testIframeFile = resolve("./test_iframe.md");
  const testIframe = await Deno.readTextFile(testIframeFile);
  await converter.convert({ mdString: testIframe, fileName: testIframeFile });

  const testTableFile = resolve("./test_table.md");
  const testTable = await Deno.readTextFile(testTableFile);
  await converter.convert({ mdString: testTable, fileName: testTableFile });

  existsFile("output.json")
    .then((result) => assert(result));
});

Deno.test("converter.convert complex markdown", async () => {
  const converter = new Converter(parseYamlAndProcessAttachments);
  const fileName =
    "./md/個人_15c5c5a9f6/tsuru/インターンシップ/チャットアプリ開発ハンズオン/01_プロジェクトのツリー構造と各ファイルの説明_0a559f6f96.md";
  const mdString = await Deno.readTextFile(fileName);
  const { md } = await converter.convert({ mdString, fileName });
  console.log(md);
});
