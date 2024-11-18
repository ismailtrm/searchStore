const puppeteer = require('puppeteer');

async function scrapeWebsite() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');

    const data = await page.evaluate(() =>
        Array.from(document.querySelectorAll('h2')).map(el => el.textContent)
    );

    await browser.close();
    return data;
}

module.exports = { scrapeWebsite };