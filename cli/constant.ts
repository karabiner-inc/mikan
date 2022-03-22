import "https://deno.land/x/dotenv@v3.1.0/load.ts";
// import { config } from "./deps.ts";
// const { NOTION_API_KEY, NOTION_ROOT_PARENT_ID, DEBUG_MODE } = config();
export const NOTION_API_KEY: string = Deno.env.get("NOTION_API_KEY") as string;
export const NOTION_ROOT_PARENT_ID: string = Deno.env.get(
  "NOTION_ROOT_PARENT_ID",
) as string;
export const TOKEN_V2: string = Deno.env.get("TOKEN_V2") as string;
export const DEBUG_MODE: boolean = Deno.env.get("DEBUG_MODE") === "true"
  ? true
  : false;
