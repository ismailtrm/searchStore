const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("results");

searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value;
    // TODO: Burada mağazalardan veri çekme işlemleri yapılacak
    // Verileri çektikten sonra resultsDiv içine sonuçlar eklenecek
});

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function scrapeTrendyol(searchTerm) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.trendyol.com/sr?q=${searchTerm}`);
    await page.waitForSelector('.p-card-wrppr'); // Ürünlerin yüklenmesini bekle

    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);
    const products = [];

    $('.p-card-wrppr').each((index, element) => {
        const productTitle = $(element).find('.prdct-desc-cntnr-name').text().trim();
        const productPrice = $(element).find('.prc-box-dscntd').text().trim();
        const productImage = $(element).find('.p-card-img img').attr('src');

        products.push({
            title: productTitle,
            price: productPrice,
            image: productImage
        });
    });

    return products;
}


searchButton.addEventListener("click", async () => {
    const searchTerm = searchInput.value;
    resultsDiv.innerHTML = ""; 

    const trendyolProducts = await scrapeTrendyol(searchTerm);
    displayResults("Trendyol", trendyolProducts); // Trendyol sonuçlarını göster
});

function displayResults(store, data) {
    // TODO: Bu fonksiyonu, gelen verilere göre ürünleri listeleyecek şekilde tamamlayın
    for (const product of data) {
        const productElement = document.createElement('div');
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.price}</p>
            <img src="${product.image}" alt="${product.title}">
        `;
        resultsDiv.appendChild(productElement);
    }
}
