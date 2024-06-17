const fetch = require('node-fetch');
const cheerio = require('cheerio');

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("results");

async function scrapeTrendyol(searchTerm) {
    const response = await fetch(`https://www.trendyol.com/sr?q=${searchTerm}`);
    const html = await response.text();

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

    try {
        const trendyolProducts = await scrapeTrendyol(searchTerm);
        displayResults("Trendyol", trendyolProducts);
    } catch (error) {
        console.error("Trendyol'dan veri çekerken hata oluştu:", error);
        resultsDiv.innerHTML = "<p>Ürünler yüklenirken bir hata oluştu.</p>";
    }
});

function displayResults(store, data) {
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
