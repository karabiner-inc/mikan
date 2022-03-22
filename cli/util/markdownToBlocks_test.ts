import { convertMarkdownToNotionBlock } from "./markdownToBlocks.ts";
import { pathResolverFactory } from "../../util.ts";
import { assertEquals } from "../../dev_deps.ts";

const resolve = pathResolverFactory(import.meta);

Deno.test("convert simle markdown", async (test) => {
  const { blocks } = await convertMarkdownToNotionBlock(
    resolve("../test/md/sample1.md"),
  );

  await test.step("block contains 3 items", () => {
    assertEquals(blocks.length, 3);
  });

  const expectBlock = [
    { object: "block", type: "heading_1" },
    { object: "block", type: "heading_2" },
    { object: "block", type: "paragraph" },
  ];

  await Promise.all(
    expectBlock.map((expect, i) => {
      test.step({
        name: `block is ${expect.type}`,
        fn: () => {
          assertEquals(blocks[i].object, expect.object);
          assertEquals(blocks[i].type, expect.type);
        },
        sanitizeOps: false,
        sanitizeResources: false,
        sanitizeExit: false,
      });
    }),
  );
});

Deno.test("convert markdown containing img tags", async (test) => {
  const { blocks } = await convertMarkdownToNotionBlock(
    resolve("../test/md/image.md"),
  );

  await test.step("block contains 2 items", () => {
    assertEquals(blocks.length, 2);
  });

  const expectBlock = [
    { object: "block", type: "image" },
    { object: "block", type: "image" },
  ];

  await Promise.all(expectBlock.map((expect, i) => {
    test.step({
      name: `block is ${expect.type}`,
      fn: () => {
        assertEquals(blocks[i].object, expect.object);
        assertEquals(blocks[i].type, expect.type);
      },
      sanitizeOps: false,
      sanitizeResources: false,
      sanitizeExit: false,
    });
  }));
});

Deno.test("convert real markdown file exported from notepm", async (test) => {
  const { blocks } = await convertMarkdownToNotionBlock(
    resolve("../test/md/real_image.md"),
  );

  const imageBlocks = blocks.filter((block) => block.type === "image");

  await test.step("file contains 2 image blocks", () => {
    assertEquals(imageBlocks.length, 2);
  });
});
