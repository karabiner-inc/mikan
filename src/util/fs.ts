const excludes = [".DS_Store"];

export const readDirRecursively = (
  rootDir: string,
  files: string[] = []
): string[] => {
  const pathList = Deno.readDirSync(rootDir);
  const dirs: string[] = [];
  for (const path of pathList) {
    const stat = Deno.statSync(`${rootDir}/${path.name}`);
    if (stat.isDirectory) {
      dirs.push(`${rootDir}/${path.name}`);
    } else if (excludes.find((v) => v !== path.name)) {
      files.push(`${rootDir}/${path.name}`);
    }
  }
  dirs.forEach((dir) => (files = readDirRecursively(dir, files)));
  return files;
};