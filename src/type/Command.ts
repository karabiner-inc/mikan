export type Command = {
  name: string;
  desc: string;
  action: (options: any) => Promise<void>;
};
