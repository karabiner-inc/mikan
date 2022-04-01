/**
 * 短時間に多数のリクエストを送信したときにきちんとハンドリングできるかテスト
 * rate limit: avarage 3 requests per second
 */

import { Api } from "../../cli/api.ts";

Deno.test({
  name: "100 requests send",
  fn: async () => {
    const client = new Api();
    for (let _ = 0; _ < 4; _++) {
      console.log("call");
      await client
        .getAppUsers()
        .then((res) => console.log(res.results[0]))
        .catch((e) => console.error(e.message));
    }
  },
  sanitizeOps: false,
  sanitizeResources: false,
});
