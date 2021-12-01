export {
  assertEquals,
  assert,
} from "https://deno.land/std@0.116.0/testing/asserts.ts";
export {
  spy,
  stub,
  assertSpyCallAsync,
  assertSpyCalls,
  assertSpyCall,
  resolvesNext,
} from "https://deno.land/x/mock@0.12.1/mod.ts";
export type { Spy, Stub } from "https://deno.land/x/mock@0.12.1/mod.ts";
export { Rhum } from "https://deno.land/x/rhum@v1.1.11/mod.ts";
import faker from "https://cdn.skypack.dev/faker@5.5.3?dts";
export { faker };
