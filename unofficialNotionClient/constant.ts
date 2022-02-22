import "https://deno.land/x/dotenv/load.ts";
export const BASE_URL = "https://www.notion.so";
export const API_BASE_URL = BASE_URL + "/api/v3";
export const TOKEN_V2: string = Deno.env.get("TOKEN_V2") as string;
