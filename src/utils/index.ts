import axios from "axios";
import * as cheerio from "cheerio";
import { randomUUID } from "crypto";

export async function fetchHtml(url: string): Promise<cheerio.CheerioAPI> {
    const response = await axios.get<string>(url);
    return cheerio.load(response.data);
  }

  export function genId(): string {
    return randomUUID();
  }