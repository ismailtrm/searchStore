(function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var fetchOpen = window.fetch && window.fetch.prototype && window.fetch.prototype.open;

    if (fetchOpen) {
        fetch.prototype.open = function() {
            var args = slice.call(arguments);
            var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
            if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
                targetOrigin[1] !== cors_api_host) {
                args[1] = cors_api_url + args[1];
            }
            return fetchOpen.apply(this, args);
        };
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchQuery = document.getElementById('search-query');
    const resultsSection = document.getElementById('results');

    const dataSources = {
        trendyol: {
            checkboxId: 'trendyol',
            fetchData: fetchTrendyolData
        },
        bershka: {
            checkboxId: 'bershka',
            fetchData: fetchBershkaData
        }
    };

    searchButton.addEventListener('click', function() {
        const query = searchQuery.value.trim();
        const selectedSources = Object.keys(dataSources).filter(source => document.getElementById(dataSources[source].checkboxId).checked);
        
        if (query !== "" && selectedSources.length > 0) {
            resultsSection.innerHTML = ''; // Clear previous results
            resultsSection.className = selectedSources.length === 2 ? 'column-container double-column' : 'column-container single-column';

            selectedSources.forEach(source => {
                dataSources[source].fetchData(query);
            });
        } else {
            resultsSection.innerHTML = '<p>Lütfen arama yapmak için bir kelime girin ve en az bir kaynak seçin.</p>';
        }
    });
        
    function fetchTrendyolData(query) {
        const url = `https://www.trendyol.com/sr?q=${encodeURIComponent(query)}`;
        
        fetch(url, {
            headers: {
                'Origin': 'https://search-store.vercel.app/'
            },
            mode: 'no-cors' 
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

                const data = JSON.parse(jsonString);
                
                data.products.forEach((product, index) => {
                    const siteUrl = 'https://www.trendyol.com';
                    const productUrl = `${siteUrl}${product.url}`;
                    const imgSrcUrl = 'https://cdn.dsmcdn.com';

                    const productElement = createProductElement(product, imgSrcUrl, productUrl);
                    resultsSection.appendChild(productElement);

                    setupImageSlider(`image-slider-trendyol-${index}`, productElement);
                });
            } else {
                resultsSection.innerHTML = '<p>Belirtilen <script> içeriği bulunamadı.</p>';
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            resultsSection.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
        });
    }

    function fetchBershkaData(query) {
        const url = `https://www.bershka.com/tr/q/${encodeURIComponent(query)}`;
        
        fetch(url, {
            headers: {
                'Origin': 'https://search-store.vercel.app/'
            },
            mode: 'no-cors' 
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

                const data = JSON.parse(jsonString);
                
                data.products.forEach((product, index) => {
                    const siteUrl = 'https://www.bershka.com';
                    const productUrl = `${siteUrl}${product.url}`;
                    const imgSrcUrl = 'https://cdn.dsmcdn.com';

                    const productElement = createProductElement(product, imgSrcUrl, productUrl);
                    resultsSection.appendChild(productElement);

                    setupImageSlider(`image-slider-bershka-${index}`, productElement);
                });
            } else {
                resultsSection.innerHTML = '<p>Belirtilen <script> içeriği bulunamadı.</p>';
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            resultsSection.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
        });
    }

    function createProductElement(product, imgSrcUrl, productUrl) {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        const sliderImages = product.images.map((image, i) => `
            <img src="${imgSrcUrl}${image}" alt="${product.imageAlt}_${i}">
        `).join('');

        productElement.innerHTML = `
            <div class="image-slider" id="image-slider">
                ${sliderImages}
            </div>
            <a href="${productUrl}" target="_blank">${product.name}</a>
            <p>Price: ${product.price.sellingPrice}</p>
        `;

        return productElement;
    }

    function setupImageSlider(sliderId, productElement) {
        const images = productElement.querySelectorAll(`#${sliderId} img`);
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

        showSlide(currentIndex);
        setInterval(nextSlide, 3000);
    }
});
