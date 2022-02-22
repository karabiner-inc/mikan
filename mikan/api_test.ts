import { Api } from "./api.ts";
import { NOTION_ROOT_PARENT_ID } from "./constant.ts";
import { assert, Rhum } from "./dev_deps.ts";
import { apiMockServiceCollection } from "@/di/serviceCollection.ts";

const api = apiMockServiceCollection.get(Api);
Deno.test("api test: cretePage() is true if a page exist", async () => {
  try {
    const isPageExist = await api.isPageExist(NOTION_ROOT_PARENT_ID);
    assert(isPageExist);
  } finally {
    assert(true);
  }
});

Rhum.testPlan("test api.ts", () => {
  Rhum.testSuite("call Notion APIs", () => {
    Rhum.testCase("isPageExist()", async () => {
      await api.addEmptyPage("hoge", "asdf");
    });
    Rhum.testCase("addPage()", () => {});
    Rhum.testCase("appendChildrenBlock()", () => {});
    Rhum.testCase("addEmptyPage()", () => {});
  });
});

Rhum.run();
