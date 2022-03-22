type FrontMatter = any;
type FrontMatterProcessor = (frontmatterString: string) => false | FrontMatter;
export type Converter = (param: {
  mdString: string;
  fileName: string;
  frontmatterProcessor: FrontMatterProcessor;
}) => Promise<{ md: string; frontmatter: false | FrontMatter }>;
