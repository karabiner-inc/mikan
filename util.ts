import { fromFileUrl } from "./deps.ts";

/**
 * ## Usage
 *
 * ```typescript
 * const resolve = pathResolverFactory(import.meta)
 * // pwd: /path/to/current/working/directory
 * resolve("./hoge.txt") // => /path/to/current/working/directory/hoge.txt
 * ```
 */
export const pathResolverFactory = (meta: ImportMeta) => {
  return (p: string) => fromFileUrl(new URL(p, meta.url));
};
