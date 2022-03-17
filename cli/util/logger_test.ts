import { log } from "./logger.ts";
import { faker, assert, Rhum } from "@/dev_deps.ts";

const range = (num: number) => Array.from(Array(num), (_val, key) => key);
const createHugeArray = () => {
  const arr: { branch: string; message: string; content: string }[] = [];
  range(10).forEach((_v) => {
    arr.push({
      branch: faker.git.branch(),
      message: faker.git.commitMessage(),
      content: faker.lorem.sentences(),
    });
  });
  return arr;
};
Deno.test("call all method with same string", () => {
  console.log();
  const testString = "Hello World!";
  log.debug(testString);
  log.info(testString);
  log.warn(testString);
  log.error(testString);
  log.critical(testString);
  assert(true);
});

Deno.test("call all method with deferent string", () => {
  console.log();
  log.debug(faker.name.findName());
  log.info(faker.name.findName());
  log.warn(faker.name.findName());
  log.error(faker.name.findName());
  log.critical(faker.name.findName());
  assert(true);
});

Deno.test("call debug() and info() method with object", () => {
  console.log();
  log.debug(createHugeArray());
  log.info(createHugeArray());
  assert(true);
});
