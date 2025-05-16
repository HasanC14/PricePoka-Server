const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;
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
// Scraper for StarTech
const scrapeStarTech = async (product) => {
  try {
    const response = await axios.get(
      `https://www.startech.com.bd/product/search?search=${product}`
    );
    const $ = cheerio.load(response.data);
    const products = [];
    const logo = $(".brand img").attr("src") || "logo not found";
    $(".p-item").each((index, element) => {
      const name =
        $(element).find(".p-item-name").text().trim() || "Name not found";
      const price =
        $(element).find(".price-new").text().trim() ||
        $(element).find(".p-item-price").text().trim() ||
        "Out Of Stock";

      const img =
        $(element).find(".p-item-img img").attr("src") || "Image not found";
      const link =
        $(element).find(".p-item-img a").attr("href") || "Link not found";
      const id = crypto.randomUUID();
      products.push({ id, name, price, img, link });
    });

    return { products, logo };
  } catch (error) {
    console.error("Error scraping StarTech:", error);
    return [];
  }
};

// Scraper for TechLand
const scrapeTechLand = async (product) => {
  try {
    const response = await axios.get(
      `https://www.techlandbd.com/index.php?route=product/search&search=${product}`
    );
    const $ = cheerio.load(response.data);
    const products = [];
    const logo = $("#logo img").attr("src") || "logo not found";
    $(".product-layout").each((index, element) => {
      const name = $(element).find(".name").text().trim() || "Name not found";
      const price =
        $(element).find(".price-new").text().trim() || "Out Of Stock";
      const img =
        $(element).find(".image img").attr("src") || "Image not found";
      const link =
        $(element).find(".product-img").attr("href") || "Link not found";

      const id = crypto.randomUUID();
      products.push({ id, name, price, img, link });
    });

    return { products, logo };
  } catch (error) {
    console.error("Error scraping TechLand:", error);
    return [];
  }
};
const scrapeRyans = async (product) => {
  try {
    const response = await axios.get(
      `https://www.ryans.com/search?q=${product}`
    );
    const $ = cheerio.load(response.data);
    const products = [];
    const logo = $(".main-logo img").attr("src") || "logo not found";
    $(".category-single-product").each((index, element) => {
      const name =
        $(element).find(".card-text a").text().trim() || "Name not found";
      const price = $(element).find(".pr-text").text().trim() || "Out Of Stock";
      const img =
        $(element).find(".image-box img").attr("src") || "Image not found";
      const link =
        $(element).find(".image-box a").attr("href") || "Link not found";

      const id = crypto.randomUUID();
      products.push({ id, name, price, img, link });
    });

    return { products, logo };
  } catch (error) {
    console.error("Error scraping TechLand:", error);
    return [];
  }
};
const scrapeBinary = async (product) => {
  try {
    const response = await axios.get(
      `https://www.binarylogic.com.bd/search/${product}`
    );
    const $ = cheerio.load(response.data);
    const products = [];
    const logo = $(".homepage_two__log svg").attr("src") || "logo not found";
    $(".single_product").each((index, element) => {
      const name =
        $(element).find(".p-item-name").text().trim() || "Name not found";
      const price =
        $(element).find(".current_price").text().trim() || "Out Of Stock";
      const img =
        $(element).find(".p-item-img img").attr("src") || "Image not found";
      const link =
        $(element).find(".p-item-img a").attr("href") || "Link not found";

      const id = crypto.randomUUID();
      products.push({ id, name, price, img, link });
    });

    return { products, logo };
  } catch (error) {
    console.error("Error scraping TechLand:", error);
    return [];
  }
};
const scrapePcHouse = async (product) => {
  try {
    const response = await axios.get(
      `https://www.pchouse.com.bd/index.php?route=product/search&search=${product}`
    );
    const $ = cheerio.load(response.data);
    const products = [];
    const logo = $("#logo img").attr("src") || "logo not found";
    $(".product-layout").each((index, element) => {
      const name = $(element).find(".name").text().trim() || "Name not found";
      const price =
        $(element).find(".price-new").text().trim() || "Out Of Stock";
      const img =
        $(element).find(".product-img img").attr("src") || "Image not found";
      const link =
        $(element).find(".product-img").attr("href") || "Link not found";

      const id = crypto.randomUUID();
      products.push({ id, name, price, img, link });
    });

    return { products, logo };
  } catch (error) {
    console.error("Error scraping TechLand:", error);
    return [];
  }
};

const scrapeUltraTech = async (product) => {
  try {
    const response = await axios.get(
      `https://www.ultratech.com.bd/index.php?route=product/search&search=${product}`
    );
    const $ = cheerio.load(response.data);
    const products = [];
    const logo = $("#logo img").attr("src") || "logo not found";
    $(".product-layout").each((index, element) => {
      const name = $(element).find(".name").text().trim() || "Name not found";
      const price =
        $(element).find(".price-new").text().trim() || "Out Of Stock";
      const img =
        $(element).find(".product-img img").attr("src") || "Image not found";
      const link =
        $(element).find(".product-img").attr("href") || "Link not found";

      const id = crypto.randomUUID();
      products.push({ id, name, price, img, link });
    });

    return { products, logo };
  } catch (error) {
    console.error("Error scraping TechLand:", error);
    return [];
  }
};
// const scrapeVibeGaming = async (product) => {
//   try {
//     const response = await axios.get(
//       `https://vibegaming.com.bd/?s=${product}&post_type=product`,
//       {
//         headers: {
//           "X-Forwarded-For": "119.30.41.88",
//         },
//       }
//     );

//     const $ = cheerio.load(response.data);
//     const products = [];
//     const logo = $(".sticky-logo").attr("data-src") || "logo not found";
//     $(".product").each((index, element) => {
//       const name =
//         $(element).find(".product-name").text().trim() || "Name not found";

//       let lowestPrice = 0;
//       const priceElements = $(element).find(".amount");

//       if (priceElements.length > 0) {
//         let min = Infinity;
//         priceElements.each((i, el) => {
//           const text = $(el)
//             .text()
//             .replace(/[^\d.]/g, "");
//           const value = parseFloat(text);
//           if (!isNaN(value) && value < min) {
//             min = value;
//           }
//         });
//         if (min !== Infinity) {
//           lowestPrice = `৳${min.toLocaleString()}`;
//         }
//       }

//       const img =
//         $(element).find(".no-back-image img").attr("data-src") ||
//         "Image not found";
//       const link =
//         $(element).find(".thumbnail-wrapper a").attr("href") ||
//         "Link not found";
//       const id = crypto.randomUUID();

//       products.push({ id, name, price: lowestPrice, img, link });
//     });

//     return { products, logo };
//   } catch (error) {
//     console.error("Error scraping TechLand:", error);
//     return [];
//   }
// };
const scrapeSkyLand = async (product) => {
  try {
    const response = await axios.get(
      `https://www.skyland.com.bd/index.php?route=product/search&search=${product}`
    );
    const $ = cheerio.load(response.data);
    const products = [];
    const logo = $("#logo img").attr("src") || "logo not found";
    $(".product-layout").each((index, element) => {
      const name = $(element).find(".name").text().trim() || "Name not found";
      const price =
        $(element).find(".price-new").text().trim() || "Out Of Stock";
      const img =
        $(element).find(".product-img img").attr("src") || "Image not found";
      const link =
        $(element).find(".product-img").attr("href") || "Link not found";

      const id = crypto.randomUUID();
      products.push({ id, name, price, img, link });
    });

    return { products, logo };
  } catch (error) {
    console.error("Error scraping TechLand:", error);
    return [];
  }
};
const scrapePotakaIT = async (product) => {
  try {
    const response = await axios.get(
      `https://www.potakait.com/index.php?route=product/search&search=${product}`
      // {
      //   headers: {
      //     "User-Agent":
      //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      //     Accept: "application/json, text/plain, */*",
      //     "Accept-Encoding": "gzip, deflate, br",
      //     Connection: "keep-alive",
      //     "Upgrade-Insecure-Requests": "1",
      //     "Cache-Control": "max-age=0",
      //     TE: "Trailers",
      //     DNT: "1", // Do Not Track header
      //     Referer: "https://www.potakait.com", // Referer header may help
      //     Origin: "https://www.potakait.com", // Sometimes needed
      //     Cookie: "ar_debug=1",
      //   },
      // }
    );

    const $ = cheerio.load(response.data);
    const products = [];
    const logo = $("#logo img").attr("src") || "logo not found";
    $(".product-layout").each((index, element) => {
      const name = $(element).find(".name").text().trim() || "Name not found";
      const price =
        $(element).find(".price-new").text().trim() ||
        $(element).find(".price-normal").text().trim() ||
        "Out Of Stock";
      const img =
        $(element).find(".product-img img").attr("data-src") ||
        $(element).find(".product-img img").attr("data-lazy") ||
        "Image not found";
      const link =
        $(element).find(".product-img").attr("href") || "Link not found";

      const id = crypto.randomUUID();
      products.push({ id, name, price, img, link });
    });

    return { products, logo };
  } catch (error) {
    console.error("Error scraping PotakaIt:", error);
    return [];
  }
};

app.get("/scrape/:product", async (req, res) => {
  let product = req.params.product;
  product = product.replace(/\s+/g, "%20");

  const [
    starTechProducts,
    techLandProducts,
    skyLandProducts,
    ryansProducts,
    pchouseProducts,
    ultraProducts,
    binaryProducts,
    // VibeGamingProducts,
    potakaProducts,
  ] = await Promise.all([
    scrapeStarTech(product),
    scrapeTechLand(product),
    scrapeSkyLand(product),
    scrapeRyans(product),
    scrapePcHouse(product),
    scrapeUltraTech(product),
    scrapeBinary(product),
    // scrapeVibeGaming(product),
    scrapePotakaIT(product),
  ]);

  res.json([
    {
      name: "StarTech",
      products: starTechProducts.products,
      logo: starTechProducts.logo,
    },
    {
      name: "TechLand",
      products: techLandProducts.products,
      logo: techLandProducts.logo,
    },
    {
      name: "SkyLand",
      products: skyLandProducts.products,
      logo: skyLandProducts.logo,
    },
    {
      name: "Ryans",
      products: ryansProducts.products,
      logo: ryansProducts.logo,
    },

    {
      name: "PcHouse",
      products: pchouseProducts.products,
      logo: pchouseProducts.logo,
    },
    {
      name: "UltraTech",
      products: ultraProducts.products,
      logo: ultraProducts.logo,
    },
    // {
    //   name: "Vibe Gaming",
    //   products: VibeGamingProducts.products,
    //   logo: VibeGamingProducts.logo,
    // },
    {
      name: "Binary",
      products: binaryProducts.products,
      logo: binaryProducts.logo,
    },
    {
      name: "PotakaIT",
      products: potakaProducts.products,
      logo: potakaProducts.logo,
    },
    // TechLand: techLandProducts,
    // Ryans: ryansProducts,
    // Binary: binaryProducts,
    // PotakaIT: potakaProducts,
    // PcHouse: pchouseProducts,
    // UltraTech: ultraProducts,
    // SkyLand: skyLandProducts,
  ]);
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
app.get("/", (req, res) => {
  res.send("Welcome to the PricePoka's Scraper API!");
});
