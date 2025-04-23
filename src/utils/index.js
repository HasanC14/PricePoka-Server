import axios from "axios";
import * as cheerio from "cheerio";
import { randomUUID } from "crypto";

export async function fetchHtml(url) {
    const response = await axios.get(url);
    return cheerio.load(response.data);
  }

  export function genId() {
    return randomUUID();
  }