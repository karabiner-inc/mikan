const excludes = [".DS_Store"];

export const readdirRecursively = (
  rootDir: string,
  files: string[] = []
): string[] => {
  const pathList = Deno.readDirSync(rootDir);
  const dirs: string[] = [];
  for (const path of pathList) {
    const stats = Deno.statSync(`${rootDir}/${path.name}`);
    if (stats.isDirectory) {
      dirs.push(`${rootDir}/${path.name}`);
    } else if (excludes.find((v) => v !== path.name)) {
      files.push(`${rootDir}/${path.name}`);
    }
  }
  dirs.forEach((dir) => (files = readdirRecursively(dir, files)));
  return files;
};
