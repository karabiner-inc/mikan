import "https://cdn.skypack.dev/@abraham/reflection@0.8.0";

import { Api } from "@/api.ts";
import { NOTION_API_KEY } from "@/constant.ts";
import { Client, ServiceCollection } from "@/deps.ts";
import { Rhum } from "@/dev_deps.ts";
import { types } from "./types.ts";

export const apiServiceCollection = new ServiceCollection();
const realClient = new Client({ auth: NOTION_API_KEY });
apiServiceCollection.addStatic(types.client, realClient);
apiServiceCollection.addTransient(Api);

export const apiMockServiceCollection = new ServiceCollection();
const stubClient = Rhum.stubbed(new Client({ auth: NOTION_API_KEY }));
stubClient.stub("pages", {
  create: ({ parent: {}, properties: {} }) => ({ page_id: "asdf" }),
});
apiMockServiceCollection.addStatic(types.client, stubClient);
apiMockServiceCollection.addTransient(Api);
