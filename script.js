(function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchQuery = document.getElementById('search-query');
    const resultsSection = document.getElementById('results');
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    
    searchButton.addEventListener('click', function() {
        const query = searchQuery.value.trim();
        if (query !== "") {
            const url = `https://www.trendyol.com/sr?q=${encodeURIComponent(query)}`;
            
            fetch(proxyUrl + url, {
                headers: {
                    'Origin': 'https://search-store.vercel.app/' // Replace with your actual domain
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
                    
                    resultsSection.innerHTML = ''; // Clear previous results

                    data.products.forEach((product, index) => {
                        const siteUrl = 'https://www.trendyol.com';
                        const productUrl = `${siteUrl}${product.url}`;
                        const imgSrcUrl = 'https://cdn.dsmcdn.com';

                        // Create a new product element
                        const productElement = document.createElement('div');
                        productElement.classList.add('product');

                        // Generate the slider images HTML
                        const sliderImages = product.images.map((image, i) => `
                            <img src="${imgSrcUrl}${image}" alt="${product.imageAlt}_${i}">
                        `).join('');

                        productElement.innerHTML = `
                            <div id="image-slider-${index}" class="image-slider">
                                ${sliderImages}
                            </div>
                            <a href="${productUrl}" target="_blank">${product.name}</a>
                            <p>Price: ${product.price.sellingPrice}</p>
                        `;

                        resultsSection.appendChild(productElement);

                        // Initialize the slider for this product
                        const images = productElement.querySelectorAll(`#image-slider-${index} img`);
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

                        showSlide(currentIndex); // Show the first image
                        setInterval(nextSlide, 3000); // 3000 ms = 3 seconds for slide change
                    });
                } else {
                    resultsSection.innerHTML = '<p>Belirtilen <script> içeriği bulunamadı.</p>';
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                resultsSection.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
                console.log(proxyUrl + encodeURIComponent(url));
            });

            resultsSection.innerHTML = `
                <div>
                    <h2>Trendyol</h2>
                    <p><a href="${url}" target="_blank">Arama Sonuçları Yükleniyor | Lütfen Bekleyiniz...</a></p>
                </div>
            `;
        } else {
            resultsSection.innerHTML = '<p>Lütfen arama yapmak için bir kelime girin.</p>';
        }
    });
});
