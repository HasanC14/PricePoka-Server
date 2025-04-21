import { fetchHtml, genId } from ".";
import { Product, ScrapeResult } from "../interfaces/common";

export async function scrapeStarTech(product: string): Promise<ScrapeResult> {
  
  const url = `https://www.startech.com.bd/product/search?search=${encodeURIComponent(product)}`;
  

  const $ = await fetchHtml(url);
    const products: Product[] = [];
    const logo = $(".brand img").attr("src") || "logo not found";
  
    $(".p-item").each((_, element) => {
      const name = $(element).find(".p-item-name").text().trim() || "Name not found";
      const price =
        $(element).find(".price-new").text().trim() ||
        $(element).find(".p-item-price").text().trim() ||
        "Out Of Stock";
      const img = $(element).find(".p-item-img img").attr("src") || "Image not found";
      const link = $(element).find(".p-item-img a").attr("href") || "Link not found";
      const id = genId();
  
      products.push({ id, name, price, img, link });
    });
  
    return { name: "StarTech", products, logo };
  }
  

  export async function scrapeTechLand(product: string): Promise<ScrapeResult> {
    const url = `https://www.techlandbd.com/index.php?route=product/search&search=${encodeURIComponent(product)}`;
    const $ = await fetchHtml(url);
    const products: Product[] = [];
    const logo = $("#logo img").attr("src") || "logo not found";
  
    $(".product-layout").each((_, element) => {
      const name = $(element).find(".name").text().trim() || "Name not found";
      const price = $(element).find(".price-new").text().trim() || "Out Of Stock";
      const img = $(element).find(".image img").attr("src") || "Image not found";
      const link = $(element).find(".product-img").attr("href") || "Link not found";
      const id = genId();
  
      products.push({ id, name, price, img, link });
    });
  
    return { name: "TechLand", products, logo };
  }
  
 
  export async function scrapeRyans(product: string): Promise<ScrapeResult> {
    const url = `https://www.ryans.com/search?q=${encodeURIComponent(product)}`;
    const $ = await fetchHtml(url);
    const products: Product[] = [];
    const logo = $(".main-logo img").attr("src") || "logo not found";
  
    $(".category-single-product").each((_, element) => {
      const name = $(element).find(".card-text a").text().trim() || "Name not found";
      const price = $(element).find(".pr-text").text().trim() || "Out Of Stock";
      const img = $(element).find(".image-box img").attr("src") || "Image not found";
      const link = $(element).find(".image-box a").attr("href") || "Link not found";
      const id = genId();
  
      products.push({ id, name, price, img, link });
    });
  
    return { name: "Ryans", products, logo };
  }

  export async function scrapeBinary(product: string): Promise<ScrapeResult> {
    const url = `https://www.binarylogic.com.bd/search/${encodeURIComponent(product)}`;
    const $ = await fetchHtml(url);
    const products: Product[] = [];
    const logo = $(".homepage_two__log svg").attr("src") || "logo not found";
  
    $(".single_product").each((_, element) => {
      const name = $(element).find(".p-item-name").text().trim() || "Name not found";
      const price = $(element).find(".current_price").text().trim() || "Out Of Stock";
      const img = $(element).find(".p-item-img img").attr("src") || "Image not found";
      const link = $(element).find(".p-item-img a").attr("href") || "Link not found";
      const id = genId();
  
      products.push({ id, name, price, img, link });
    });
  
    return { name: "BinaryLogic", products, logo };
  }
  

  export async function scrapePcHouse(product: string): Promise<ScrapeResult> {
    const url = `https://www.pchouse.com.bd/index.php?route=product/search&search=${encodeURIComponent(product)}`;
    const $ = await fetchHtml(url);
    const products: Product[] = [];
    const logo = $("#logo img").attr("src") || "logo not found";
  
    $(".product-layout").each((_, element) => {
      const name = $(element).find(".name").text().trim() || "Name not found";
      const price = $(element).find(".price-new").text().trim() || "Out Of Stock";
      const img = $(element).find(".product-img img").attr("src") || "Image not found";
      const link = $(element).find(".product-img").attr("href") || "Link not found";
      const id = genId();
  
      products.push({ id, name, price, img, link });
    });
  
    return { name: "PcHouse", products, logo };
  }
  

  export async function scrapeUltraTech(product: string): Promise<ScrapeResult> {
    const url = `https://www.ultratech.com.bd/index.php?route=product/search&search=${encodeURIComponent(product)}`;
    const $ = await fetchHtml(url);
    const products: Product[] = [];
    const logo = $("#logo img").attr("src") || "logo not found";
  
    $(".product-layout").each((_, element) => {
      const name = $(element).find(".name").text().trim() || "Name not found";
      const price = $(element).find(".price-new").text().trim() || "Out Of Stock";
      const img = $(element).find(".product-img img").attr("src") || "Image not found";
      const link = $(element).find(".product-img").attr("href") || "Link not found";
      const id = genId();
  
      products.push({ id, name, price, img, link });
    });
  
    return { name: "UltraTech", products, logo };
  }
  

  export async function scrapeSkyLand(product: string): Promise<ScrapeResult> {
    const url = `https://www.skyland.com.bd/index.php?route=product/search&search=${encodeURIComponent(product)}`;
    const $ = await fetchHtml(url);
    const products: Product[] = [];
    const logo = $("#logo img").attr("src") || "logo not found";
  
    $(".product-layout").each((_, element) => {
      const name = $(element).find(".name").text().trim() || "Name not found";
      const price = $(element).find(".price-new").text().trim() || "Out Of Stock";
      const img = $(element).find(".product-img img").attr("src") || "Image not found";
      const link = $(element).find(".product-img").attr("href") || "Link not found";
      const id = genId();
  
      products.push({ id, name, price, img, link });
    });
  
    return { name: "SkyLand", products, logo };
  }

  export async function scrapePotakaIT(product: string): Promise<ScrapeResult> {
    const url = `https://www.potakait.com/index.php?route=product/search&search=${encodeURIComponent(product)}`;
    const $ = await fetchHtml(url);
    const products: Product[] = [];
    const logo = $("#logo img").attr("src") || "logo not found";
  
    $(".product-layout").each((_, element) => {
      const name = $(element).find(".name").text().trim() || "Name not found";
      const price =
        $(element).find(".price-new").text().trim() ||
        $(element).find(".price-normal").text().trim() ||
        "Out Of Stock";
      const img =
        $(element).find(".product-img img").attr("data-src") ||
        $(element).find(".product-img img").attr("data-lazy") ||
        "Image not found";
      const link = $(element).find(".product-img").attr("href") || "Link not found";
      const id = genId();
  
      products.push({ id, name, price, img, link });
    });
  
    return { name: "PotakaIT", products, logo };
  }
  

  export const Scrapper= {
    scrapeStarTech,
    scrapeTechLand,
    scrapeRyans,
    scrapeBinary,
    scrapePcHouse,
    scrapeUltraTech,
    // scrapeVibeGaming,
    scrapeSkyLand,
    scrapePotakaIT
  }