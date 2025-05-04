import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { scraperSources } from "../../constant/index.js";
import { ScrapperService } from "./scraper.service.js";

const getAllScrape = catchAsync(async (req, res) => {
    let product = req.params.product;
    product = product.replace(/\s+/g, "%20");
    const scrapers = await ScrapperService.getAllScrape(product);
  
   // Filter out vendors with no products
   const filteredResponse = scraperSources.reduce((vendor, {key, name}) => {
    const products = scrapers[key]?.products;
    if(products && products?.length > 0){
      vendor.push({
        name, 
        products,
        logo: scrapers[key]?.logo,
      })
    }
    return vendor;
  }, [])
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Scraping data successfully",
    data: filteredResponse,
  });
});
export const ScrapperController= {
    getAllScrape
}