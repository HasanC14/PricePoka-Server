import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import router from "./app/routes";
const app = express();

app.use(cors());
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message:
        "You're sending too many requests. Please wait a minute and try again.",
    });
  },
});

app.use(limiter);
app.use(router);
app.get("/", (req, res) => {
  res.send("Welcome to the PricePoka's Scraper API!");
});

export default app;
