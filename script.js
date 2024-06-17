const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function searchAndScrape(searchTerm) {
    const browser = await puppeteer.launch({ headless: false }); // Non-headless for debugging
    const page = await browser.newPage();
    await page.goto('https://www.trendyol.com');
    console.log("Navigated to Trendyol");

    try {
        await page.waitForSelector('#search-input', { timeout: 5000 }); // Wait for search input
        await page.type('#search-input', searchTerm);

        await Promise.all([
            page.waitForNavigation(), // Wait for navigation after clicking search
            page.click('.search-button')
        ]);
        console.log("Clicked search button");

        await page.waitForSelector('.p-card-wrppr', { timeout: 10000 }); // Wait for results
        console.log("Results loaded");

        const html = await page.content();
        const $ = cheerio.load(html);
        const products = [];

        $('.p-card-wrppr').each((index, element) => {
            const productTitleElement = $(element).find('.prdct-desc-cntnr-name a');
            const productTitle = productTitleElement.text().trim();
            const productUrl = productTitleElement.attr('href');
            const productPrice = $(element).find('.prc-box-dscntd').text().trim();
            const productImage = $(element).find('.p-card-img img').attr('src');

            if (productTitle && productPrice && productImage && productUrl) {
                products.push({
                    title: productTitle,
                    price: productPrice,
                    image: productImage,
                    url: 'https://www.trendyol.com' + productUrl 
                });
            }
        });

        console.log("Scraped products:");
        console.log(products);
    } catch (error) {
        console.error("An error occurred during scraping:", error);
    } finally {
        await browser.close();
    }
}

const searchTerm = 'siyah etek'; 
searchAndScrape(searchTerm);
