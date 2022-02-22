/* std */
export {
  assert,
  assertEquals,
  assertNotEquals,
  assertNotMatch,
  assertObjectMatch,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.125.0/testing/asserts.ts";

import { fromFileUrl } from "https://deno.land/std@0.125.0/path/mod.ts";

export const pathResolverFactory = (meta: ImportMeta) => {
  return (p: string) => fromFileUrl(new URL(p, meta.url));
};

/* 3rd parth */
