const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 4000;
app.use(cors());

// Enhanced rate limiting
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

// Axios configuration with timeout and retry logic
const axiosConfig = {
  timeout: 10000, // 10 second timeout
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
};

// Helper function to create axios instance with retry logic
const createAxiosInstance = () => {
  const instance = axios.create(axiosConfig);

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { config } = error;
      if (!config || !config.retry) config.retry = 0;

      if (config.retry < 2 && error.code !== "ECONNABORTED") {
        config.retry += 1;
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * config.retry)
        );
        return instance(config);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

// Enhanced pagination function
function getPaginationInfo($) {
  try {
    let pagination = $("ul.pagination");
    if (!pagination.length) {
      pagination = $('nav[aria-label="Pagination"] ul');
    }
    if (!pagination.length) return 1;

    const nums = pagination
      .find("li")
      .map((i, el) => {
        const t = $(el).text().trim();
        return /^\d+$/.test(t) ? parseInt(t, 10) : null;
      })
      .get()
      .filter((n) => n !== null && !isNaN(n));

    return nums.length ? Math.max(...nums) : 1;
  } catch (error) {
    console.error("Error in getPaginationInfo:", error.message);
    return 1;
  }
}

// Enhanced scraping function with better error handling
const scrapeStarTech = async (product) => {
  const products = [];
  let logo = "logo not found";
  let pageNum = 1;
  let totalPages = 1;

  try {
    do {
      try {
        const url = `https://www.startech.com.bd/product/search?search=${encodeURIComponent(
          product
        )}&page=${pageNum}`;
        const { data } = await axiosInstance.get(url);
        const $ = cheerio.load(data);

        if (pageNum === 1) {
          const logoSrc = $(".brand img").attr("src");
          if (logoSrc) {
            logo = logoSrc.startsWith("http")
              ? logoSrc
              : `https://www.startech.com.bd${logoSrc}`;
          }
          totalPages = getPaginationInfo($);
        }

        $(".p-item").each((_, el) => {
          try {
            const name =
              $(el).find(".p-item-name").text().trim() || "Name not found";
            const price =
              $(el).find(".price-new").text().trim() ||
              $(el).find(".p-item-price").text().trim() ||
              "Out Of Stock";
            const imgSrc = $(el).find(".p-item-img img").attr("src");
            const img = imgSrc
              ? imgSrc.startsWith("http")
                ? imgSrc
                : `https://www.startech.com.bd${imgSrc}`
              : "Image not found";
            const linkHref = $(el).find(".p-item-img a").attr("href");
            const link = linkHref
              ? linkHref.startsWith("http")
                ? linkHref
                : `https://www.startech.com.bd${linkHref}`
              : "Link not found";

            products.push({ id: crypto.randomUUID(), name, price, img, link });
          } catch (itemError) {
            console.error(`Error processing StarTech item:`, itemError.message);
          }
        });

        pageNum++;
      } catch (pageError) {
        console.error(
          `Error scraping StarTech page ${pageNum}:`,
          pageError.message
        );
        break;
      }
    } while (pageNum <= totalPages && pageNum <= 10); // Limit to 10 pages max
  } catch (error) {
    console.error("Error scraping StarTech:", error.message);
  }

  return { products, logo };
};

const scrapeTechLand = async (product) => {
  const products = [];
  let logo = "logo not found";
  let pageNum = 1;
  let totalPages = 1;

  try {
    do {
      try {
        const url = `https://www.techlandbd.com/search/advance/product/result/${encodeURIComponent(
          product
        )}?page=${pageNum}`;
        const { data } = await axiosInstance.get(url);
        const $ = cheerio.load(data);

        if (pageNum === 1) {
          const logoSrc = $(".py-1.text-white.bg-gradient-to-r img").attr(
            "src"
          );
          if (logoSrc) {
            logo = logoSrc.startsWith("http")
              ? logoSrc
              : `https://www.techlandbd.com${logoSrc}`;
          }
          totalPages = getPaginationInfo($);
        }

        $(".grid > .h-full").each((_, el) => {
          try {
            const name =
              $(el).find(".text-gray-800").text().trim() || "Name not found";
            const hasStrike = $(el).find(".line-through").length > 0;
            let raw = hasStrike
              ? $(el).find("span.font-bold.text-red-600").text().trim()
              : $(el).find(".text-lg").text().trim();

            raw = raw || "";
            const price = /out of stock/i.test(raw) ? "Out of Stock" : raw;

            const imgSrc = $(el).find("img").attr("src");
            const img = imgSrc
              ? imgSrc.startsWith("http")
                ? imgSrc
                : `https://www.techlandbd.com${imgSrc}`
              : "Image not found";
            const linkHref = $(el).find("a").attr("href");
            const link = linkHref
              ? linkHref.startsWith("http")
                ? linkHref
                : `https://www.techlandbd.com${linkHref}`
              : "Link not found";

            products.push({ id: crypto.randomUUID(), name, price, img, link });
          } catch (itemError) {
            console.error(`Error processing TechLand item:`, itemError.message);
          }
        });

        pageNum++;
      } catch (pageError) {
        console.error(
          `Error scraping TechLand page ${pageNum}:`,
          pageError.message
        );
        break;
      }
    } while (pageNum <= totalPages && pageNum <= 10);
  } catch (error) {
    console.error("Error scraping TechLand:", error.message);
  }

  return { products, logo };
};

const scrapeRyans = async (product) => {
  const products = [];
  let logo = "logo not found";
  let pageNum = 1;
  let totalPages = 1;

  try {
    do {
      try {
        const url = `https://www.ryans.com/search?q=${encodeURIComponent(
          product
        )}&page=${pageNum}`;
        const { data } = await axiosInstance.get(url);
        const $ = cheerio.load(data);

        if (pageNum === 1) {
          const logoSrc = $(".main-logo img").attr("src");
          if (logoSrc) {
            logo = logoSrc.startsWith("http")
              ? logoSrc
              : `https://www.ryans.com${logoSrc}`;
          }
          totalPages = getPaginationInfo($);
        }

        $(".category-single-product").each((_, el) => {
          try {
            const name =
              $(el).find(".card-text a").text().trim() || "Name not found";
            const price =
              $(el).find(".pr-text").text().trim() || "Out Of Stock";
            const imgSrc = $(el).find(".image-box img").attr("src");
            const img = imgSrc
              ? imgSrc.startsWith("http")
                ? imgSrc
                : `https://www.ryans.com${imgSrc}`
              : "Image not found";
            const linkHref = $(el).find(".image-box a").attr("href");
            const link = linkHref
              ? linkHref.startsWith("http")
                ? linkHref
                : `https://www.ryans.com${linkHref}`
              : "Link not found";

            products.push({ id: crypto.randomUUID(), name, price, img, link });
          } catch (itemError) {
            console.error(`Error processing Ryans item:`, itemError.message);
          }
        });

        pageNum++;
      } catch (pageError) {
        console.error(
          `Error scraping Ryans page ${pageNum}:`,
          pageError.message
        );
        break;
      }
    } while (pageNum <= totalPages && pageNum <= 10);
  } catch (error) {
    console.error("Error scraping Ryans:", error.message);
  }

  return { products, logo };
};

const scrapeBinary = async (product) => {
  const products = [];
  let logo = "logo not found";
  let pageNum = 1;
  let totalPages = 1;

  try {
    do {
      try {
        const url = `https://www.binarylogic.com.bd/search/${encodeURIComponent(
          product
        )}?page=${pageNum}`;
        const { data } = await axiosInstance.get(url);
        const $ = cheerio.load(data);

        if (pageNum === 1) {
          const logoSrc = $(".homepage_two__log svg").attr("src");
          if (logoSrc) {
            logo = logoSrc.startsWith("http")
              ? logoSrc
              : `https://www.binarylogic.com.bd${logoSrc}`;
          }
          totalPages = getPaginationInfo($);
        }

        $(".single_product").each((_, el) => {
          try {
            const name =
              $(el).find(".p-item-name").text().trim() || "Name not found";
            const price =
              $(el).find(".current_price").text().trim() || "Out Of Stock";
            const imgSrc = $(el).find(".p-item-img img").attr("src");
            const img = imgSrc
              ? imgSrc.startsWith("http")
                ? imgSrc
                : `https://www.binarylogic.com.bd${imgSrc}`
              : "Image not found";
            const linkHref = $(el).find(".p-item-img a").attr("href");
            const link = linkHref
              ? linkHref.startsWith("http")
                ? linkHref
                : `https://www.binarylogic.com.bd${linkHref}`
              : "Link not found";

            products.push({ id: crypto.randomUUID(), name, price, img, link });
          } catch (itemError) {
            console.error(`Error processing Binary item:`, itemError.message);
          }
        });

        pageNum++;
      } catch (pageError) {
        console.error(
          `Error scraping Binary page ${pageNum}:`,
          pageError.message
        );
        break;
      }
    } while (pageNum <= totalPages && pageNum <= 10);
  } catch (error) {
    console.error("Error scraping Binary:", error.message);
  }

  return { products, logo };
};

const scrapePcHouse = async (product) => {
  const products = [];
  let logo = "logo not found";
  let pageNum = 1;
  let totalPages = 1;

  try {
    do {
      try {
        const url = `https://www.pchouse.com.bd/index.php?route=product/search&search=${encodeURIComponent(
          product
        )}&page=${pageNum}`;
        const { data } = await axiosInstance.get(url);
        const $ = cheerio.load(data);

        if (pageNum === 1) {
          const logoSrc = $("#logo img").attr("src");
          if (logoSrc) {
            logo = logoSrc.startsWith("http")
              ? logoSrc
              : `https://www.pchouse.com.bd${logoSrc}`;
          }
          totalPages = getPaginationInfo($);
        }

        $(".product-layout").each((_, el) => {
          try {
            const name = $(el).find(".name").text().trim() || "Name not found";
            const price =
              $(el).find(".price-new").text().trim() || "Out Of Stock";
            const imgSrc = $(el).find(".product-img img").attr("src");
            const img = imgSrc
              ? imgSrc.startsWith("http")
                ? imgSrc
                : `https://www.pchouse.com.bd${imgSrc}`
              : "Image not found";
            const linkHref = $(el).find(".product-img").attr("href");
            const link = linkHref
              ? linkHref.startsWith("http")
                ? linkHref
                : `https://www.pchouse.com.bd${linkHref}`
              : "Link not found";

            products.push({ id: crypto.randomUUID(), name, price, img, link });
          } catch (itemError) {
            console.error(`Error processing PcHouse item:`, itemError.message);
          }
        });

        pageNum++;
      } catch (pageError) {
        console.error(
          `Error scraping PcHouse page ${pageNum}:`,
          pageError.message
        );
        break;
      }
    } while (pageNum <= totalPages && pageNum <= 10);
  } catch (error) {
    console.error("Error scraping PcHouse:", error.message);
  }

  return { products, logo };
};

const scrapeUltraTech = async (product) => {
  const products = [];
  let logo = "logo not found";
  let pageNum = 1;
  let totalPages = 1;

  try {
    do {
      try {
        const url = `https://www.ultratech.com.bd/index.php?route=product/search&search=${encodeURIComponent(
          product
        )}&page=${pageNum}`;
        const { data } = await axiosInstance.get(url);
        const $ = cheerio.load(data);

        if (pageNum === 1) {
          const logoSrc = $("#logo img").attr("src");
          if (logoSrc) {
            logo = logoSrc.startsWith("http")
              ? logoSrc
              : `https://www.ultratech.com.bd${logoSrc}`;
          }
          totalPages = getPaginationInfo($);
        }

        $(".product-layout").each((_, el) => {
          try {
            const name = $(el).find(".name").text().trim() || "Name not found";
            const price =
              $(el).find(".price-new").text().trim() || "Out Of Stock";
            const imgSrc = $(el).find(".product-img img").attr("src");
            const img = imgSrc
              ? imgSrc.startsWith("http")
                ? imgSrc
                : `https://www.ultratech.com.bd${imgSrc}`
              : "Image not found";
            const linkHref = $(el).find(".product-img").attr("href");
            const link = linkHref
              ? linkHref.startsWith("http")
                ? linkHref
                : `https://www.ultratech.com.bd${linkHref}`
              : "Link not found";

            products.push({ id: crypto.randomUUID(), name, price, img, link });
          } catch (itemError) {
            console.error(
              `Error processing UltraTech item:`,
              itemError.message
            );
          }
        });

        pageNum++;
      } catch (pageError) {
        console.error(
          `Error scraping UltraTech page ${pageNum}:`,
          pageError.message
        );
        break;
      }
    } while (pageNum <= totalPages && pageNum <= 10);
  } catch (error) {
    console.error("Error scraping UltraTech:", error.message);
  }

  return { products, logo };
};

const scrapeSkyLand = async (product) => {
  const products = [];
  let logo = "logo not found";
  let pageNum = 1;
  let totalPages = 1;

  try {
    do {
      try {
        const url = `https://www.skyland.com.bd/index.php?route=product/search&search=${encodeURIComponent(
          product
        )}&page=${pageNum}`;
        const { data } = await axiosInstance.get(url);
        const $ = cheerio.load(data);

        if (pageNum === 1) {
          const logoSrc = $("#logo img").attr("src");
          if (logoSrc) {
            logo = logoSrc.startsWith("http")
              ? logoSrc
              : `https://www.skyland.com.bd${logoSrc}`;
          }
          totalPages = getPaginationInfo($);
        }

        $(".product-layout").each((_, el) => {
          try {
            const name = $(el).find(".name").text().trim() || "Name not found";
            const price =
              $(el).find(".price-new").text().trim() || "Out Of Stock";
            const imgSrc = $(el).find(".product-img img").attr("src");
            const img = imgSrc
              ? imgSrc.startsWith("http")
                ? imgSrc
                : `https://www.skyland.com.bd${imgSrc}`
              : "Image not found";
            const linkHref = $(el).find(".product-img").attr("href");
            const link = linkHref
              ? linkHref.startsWith("http")
                ? linkHref
                : `https://www.skyland.com.bd${linkHref}`
              : "Link not found";

            products.push({ id: crypto.randomUUID(), name, price, img, link });
          } catch (itemError) {
            console.error(`Error processing SkyLand item:`, itemError.message);
          }
        });

        pageNum++;
      } catch (pageError) {
        console.error(
          `Error scraping SkyLand page ${pageNum}:`,
          pageError.message
        );
        break;
      }
    } while (pageNum <= totalPages && pageNum <= 10);
  } catch (error) {
    console.error("Error scraping SkyLand:", error.message);
  }

  return { products, logo };
};

const scrapePotakaIT = async (product) => {
  const products = [];
  let logo = "logo not found";
  let pageNum = 1;
  let totalPages = 1;

  try {
    do {
      try {
        const url = `https://www.potakait.com/index.php?route=product/search&search=${encodeURIComponent(
          product
        )}&page=${pageNum}`;
        const { data } = await axiosInstance.get(url);
        const $ = cheerio.load(data);

        if (pageNum === 1) {
          const logoSrc = $(".brand-logo img").attr("src");
          if (logoSrc) {
            logo = logoSrc.startsWith("http")
              ? logoSrc
              : `https://www.potakait.com${logoSrc}`;
          }
          totalPages = getPaginationInfo($);
        }

        $(".product-item").each((_, el) => {
          try {
            const name =
              $(el).find(".title a").text().trim() || "Name not found";
            const price =
              $(el).find(".price:not(.old)").text().trim() || "Out Of Stock";
            const imgSrc =
              $(el).find(".product-img img").attr("data-src") ||
              $(el).find(".product-img img").attr("src");
            const img = imgSrc
              ? imgSrc.startsWith("http")
                ? imgSrc
                : `https://www.potakait.com${imgSrc}`
              : "Image not found";
            const linkHref = $(el).find(".title a").attr("href");
            const link = linkHref
              ? linkHref.startsWith("http")
                ? linkHref
                : `https://www.potakait.com${linkHref}`
              : "Link not found";

            products.push({ id: crypto.randomUUID(), name, price, img, link });
          } catch (itemError) {
            console.error(`Error processing PotakaIT item:`, itemError.message);
          }
        });

        pageNum++;
      } catch (pageError) {
        console.error(
          `Error scraping PotakaIT page ${pageNum}:`,
          pageError.message
        );
        break;
      }
    } while (pageNum <= totalPages && pageNum <= 10);
  } catch (error) {
    console.error("Error scraping PotakaIT:", error.message);
  }

  return { products, logo };
};

// Enhanced main scraping endpoint with parallel execution and error handling
app.get("/scrape/:product", async (req, res) => {
  try {
    let product = req.params.product;
    if (!product || product.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product parameter is required",
      });
    }

    product = product.replace(/\s+/g, "%20");

    console.log(`Starting scrape for product: ${product}`);
    const startTime = Date.now();

    // Use Promise.allSettled to ensure all scrapers run independently
    const results = await Promise.allSettled([
      scrapeStarTech(product),
      scrapeTechLand(product),
      scrapeSkyLand(product),
      scrapePcHouse(product),
      scrapeUltraTech(product),
      scrapeBinary(product),
      scrapePotakaIT(product),
      scrapeRyans(product),
    ]);

    const shopNames = [
      "StarTech",
      "TechLand",
      "SkyLand",
      "PcHouse",
      "UltraTech",
      "Binary",
      "PotakaIT",
      "Ryans",
    ];
    const allShops = [];
    let failedShops = [];

    results.forEach((result, index) => {
      const shopName = shopNames[index];
      if (result.status === "fulfilled") {
        const { products, logo } = result.value;
        allShops.push({
          name: shopName,
          products: products || [],
          logo: logo || "logo not found",
        });
        console.log(`${shopName}: ${products?.length || 0} products found`);
      } else {
        console.error(
          `${shopName} failed:`,
          result.reason?.message || "Unknown error"
        );
        failedShops.push(shopName);
        // Still add the shop with empty products to maintain consistency
        allShops.push({
          name: shopName,
          products: [],
          logo: "logo not found",
        });
      }
    });

    const shopsWithResults = allShops.filter(
      (shop) => shop.products.length > 0
    );
    const totalProducts = shopsWithResults.reduce(
      (sum, shop) => sum + shop.products.length,
      0
    );
    const endTime = Date.now();

    console.log(
      `Scraping completed in ${
        endTime - startTime
      }ms. Total products: ${totalProducts}`
    );

    if (failedShops.length > 0) {
      console.log(`Failed shops: ${failedShops.join(", ")}`);
    }

    res.json({
      success: true,
      data: shopsWithResults,
      metadata: {
        totalShops: shopsWithResults.length,
        totalProducts,
        failedShops,
        executionTime: endTime - startTime,
      },
    });
  } catch (error) {
    console.error("Error in scrape endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred while scraping",
      error: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the PricePoka's Scraper API!");
});
