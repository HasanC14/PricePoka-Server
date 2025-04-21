import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { scraperSources } from "../../constant";
import { ScrapperService } from "./scraper.service";

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