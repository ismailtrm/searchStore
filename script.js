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
        
    let jsonString = match[1].replace('window.__SEARCH_APP_INITIAL_STATE__=', '');
    jsonString = jsonString.replace(/;window\.slpName='';window\.TYPageName='product_search_result';window\.isSearchResult=true;window\.pageType="search";/, '');

    console.log(jsonString);
    const data = JSON.parse(jsonString);
    
    // İlk ürünü seçiyoruz
    const product = data.products[1]; // İndeks 0'dan başladı

    const siteUrl = 'https://www.trendyol.com';
    const productUrl = `${siteUrl}${product.url}`;
    console.log(`ProductUrl is: ${productUrl}`);

    const imgSrcUrl = 'https://cdn.dsmcdn.com';
    const imgUrl = `${imgSrcUrl}${product.images[0]}`;
    console.log(`imageUrl is: ${imgUrl}`);

    console.log(`The product price is: ${product.price.sellingPrice}`);
    // Sonuçları HTML içine yerleştirme
    resultsSection.innerHTML = `
        <div>
            <div id="image-slider">
            <img src=`${imgSrcUrl}${product.images[0]}` alt="${product.imageAlt}_0">
            <img src=`${imgSrcUrl}${product.images[1]}` alt="${product.imageAlt}_1">
            <img src=`${imgSrcUrl}${product.images[2]}` alt="${product.imageAlt}_2">
            </div>

            <img src="${imgUrl}" alt="${product.imageAlt}">
            <a href="${productUrl}">${product.name}</a>
            <p>Price: ${product.price.sellingPrice}</p>
        </div>
    `;
    const images = document.querySelectorAll('#image-slider img');
    let currentIndex = 0;

    function showSlide(index) {
        images.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) {
                img.classList.add('active');
                }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        showSlide(currentIndex);
    }

    setInterval(nextSlide, 3000); // 3000 ms = 3 seconds for slide change

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
