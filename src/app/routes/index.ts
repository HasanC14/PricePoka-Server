import express from "express";
import ScraperRoutes from "../modules/Scraper/scrapper.route";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/scrape",
    route: ScraperRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
