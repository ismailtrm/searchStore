document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchQuery = document.getElementById('search-query');
    const resultsSection = document.getElementById('results');
    //const proxyUrl = 'https://search-store.vercel.app/api/proxy?url=';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    
    searchButton.addEventListener('click', function() {
        const query = searchQuery.value;
        if (query.trim() !== "") {
            const url = `https://www.trendyol.com/sr?q=${encodeURIComponent(query)}`;
            
fetch(proxyUrl + url, {
    headers: {
        'Origin': 'https://search-store.vercel.app/', // Replace with your actual domain
        // 'X-Requested-With': 'XMLHttpRequest' // Uncomment if needed
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.text();
})
.then(html => {
    const scriptRegex = /<script type="application\/javascript">([\s\S]*?)<\/script>/;
    const match = html.match(scriptRegex);
    if (match && match[1]) {
        // <script> içeriği bulundu, şimdi bunu gösterelim
        console.log(match[1]);
       // Removing the first tag and parsing the JSON data
        const jsonString = match[1].replace('window.__SEARCH_APP_INITIAL_STATE__=', '');
        const jsonString = match[1].replace('window.slpName='';window.TYPageName='product_search_result';window.isSearchResult=true;window.pageType="search";', '');

        console.log(jsonString);
        const data = JSON.parse(jsonString);
        // Accessing the product price
        const product = data.products[0];
        const price = product.price.sellingPrice;

        console.log(`The product price is: ${price}`);
        resultsSection.innerHTML = `
                    <div>
                    <p>${product}, ${price}</p>
                    </div>
                                    `;
        } else {
        resultsSection.innerHTML = '<p>Belirtilen <script> içeriği bulunamadı.</p>';
    }})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    resultsSection.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
    console.log(proxyUrl + encodeURIComponent(url))
});
            
            resultsSection.innerHTML = `
                <div>
                    <h2>Trendyol</h2>
                    <p><a href="${url}" target="_blank">Arama Sonuçları</a></p>
                </div>
            `;
        } else {
            resultsSection.innerHTML = '<p>Lütfen arama yapmak için bir kelime girin.</p>';
        }
    });
});

// Fetch the URL
