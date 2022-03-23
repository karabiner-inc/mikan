const excludes = [".DS_Store", "_添付"];

/** ディレクトリの中を再帰的に走査してファイルリストを返す */
export const readDirRecursively = (
  rootDir: string,
  files: string[] = [],
): string[] => {
  const pathList = Deno.readDirSync(rootDir);
  const dirs: string[] = [];
  for (const path of pathList) {
    const stat = Deno.statSync(`${rootDir}/${path.name}`);
    if (stat.isDirectory) {
      dirs.push(`${rootDir}/${path.name}`);
    } else if (path.name.endsWith("md")) {
      files.push(`${rootDir}/${path.name}`);
    }
  }
  dirs.forEach((dir) => (files = readDirRecursively(dir, files)));
  return files.sort();
};
