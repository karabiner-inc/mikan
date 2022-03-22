import { parse } from "./deps.ts";

export type Result<T> = {
  readonly valid: boolean;
  readonly value: T | undefined;
};

export type Frontmatter = {
  readonly title: string;
  readonly attachments?: string[];
};

export type Attachment = {
  readonly fileName: string;
  readonly url: string;
};

export type FrontmatterProcessor<T> = (input: string) => Result<T>;
type YamlProcessor<T> = (yaml: Frontmatter) => Result<T>;

const attachmentProcessor: YamlProcessor<Attachment[]> = (
  yaml: Frontmatter,
) => {
  if (yaml.attachments) {
    // separate fileName|url
    const pattern = / https:\/\/karabiner\.notepm\.jp/;
    const value = yaml.attachments.map((attachment) => {
      const index = attachment.search(pattern);

      const fileName = attachment.slice(0, index);
      const url = attachment.slice(index + 1);

      return { fileName, url };
    });

    return { valid: true, value };
  }
  return { valid: false, value: undefined };
};

const parseYamlAndProcess = <T>(
  yamlString: string,
  processor: YamlProcessor<T>,
): Result<T> => {
  try {
    const yamlFrontmatter = parse(yamlString) as Frontmatter;
    return processor(yamlFrontmatter);
  } catch (_e) {
    return { valid: false, value: undefined };
  }
};

/** yamlをパースしてattachmentsを分解する */
export function parseYamlAndProcessAttachments(
  yamlString: string,
): Result<Attachment[]> {
  return parseYamlAndProcess(yamlString, attachmentProcessor);
}
