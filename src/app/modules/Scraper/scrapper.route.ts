import express from "express";
import { ScrapperController } from "./scraper.controller";
const ScraperRoutes = express.Router();

ScraperRoutes.get("/:product", ScrapperController.getAllScrape);

export default ScraperRoutes