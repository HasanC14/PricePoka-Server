import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { scraperSources } from "../../constant/index.js";
import { ScrapperService } from "./scraper.service.js";

const getAllScrape = catchAsync(async (req, res) => {
    let product = req.params.product;
    product = product.replace(/\s+/g, "%20");
    const scrapers = await ScrapperService.getAllScrape(product);
  
  const response = scraperSources.map(({ key, name }) => ({
    name,
    products: scrapers[key]?.products,
    logo: scrapers[key]?.logo,
  }));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Scraping data successfully",
    data: response,
  });
});
export const ScrapperController= {
    getAllScrape
}