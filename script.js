        (function() {
            var cors_api_host = 'cors-anywhere.herokuapp.com';
            var cors_api_url = 'https://' + cors_api_host + '/';
            var origin = window.location.protocol + '//' + window.location.host;

            // Save the original fetch function
            var originalFetch = fetch;

            // Override the fetch function
            window.fetch = function() {
                var args = Array.from(arguments);
                var input = args[0];
                var init = args[1] || {};

                // If input is a Request object, extract the URL
                var url = (input instanceof Request) ? input.url : input;

                var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(url);

                if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
                    targetOrigin[1] !== cors_api_host) {
                    // Prepend the CORS proxy URL
                    if (input instanceof Request) {
                        input = new Request(cors_api_url + url, input);
                    } else {
                        args[0] = cors_api_url + url;
                    }
                }

                return originalFetch.apply(this, args);
            };
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
                'method': 'GET',
                'Origin': 'https://search-store.vercel.app/'
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

                const data = JSON.parse(jsonString);
                
                data.products.forEach((product, index) => {
                    const siteUrl = 'https://www.trendyol.com';
                    const productUrl = `${siteUrl}${product.url}`;
                    const imgSrcUrl = 'https://cdn.dsmcdn.com';

                    const productElement = document.createElement('div');
                    productElement.classList.add('product');

                    const sliderImages = product.images.map((image, i) => `
                        <img src="${imgSrcUrl}${image}" alt="${product.imageAlt}_${i}">
                    `).join('');

                    productElement.innerHTML = `
                        <div id="image-slider-trendyol-${index}" class="image-slider">
                            ${sliderImages}
                        </div>
                        <a href="${productUrl}" target="_blank">${product.name}</a>
                        <p>Price: ${product.price.sellingPrice}</p>
                    `;

                    resultsSection.appendChild(productElement);

                    const images = productElement.querySelectorAll(`#image-slider-trendyol-${index} img`);
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
        
        var x = new fetch();
        x.open('GET', 'https://cors-anywhere.herokuapp.com/https://www.bershka.com/tr/q/etek');
        x.setRequestHeader('X-Requested-With', 'fetch');
        x.onload = function() {
            alert(x.responseText);
        };
        x.send();
        
    function fetchBershkaData(query) {
        const url = `https://www.bershka.com/tr/q/${encodeURIComponent(query)}`;
        var userAgent = navigator.userAgent;

        fetch(url, {
            headers: {
                'Origin': 'https://search-store.vercel.app/',
                'User-Agent': `${userAgent}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            console.log(`${html}`)
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

                    const productElement = document.createElement('div');
                    productElement.classList.add('product');

                    const sliderImages = product.images.map((image, i) => `
                        <img src="${imgSrcUrl}${image}" alt="${product.imageAlt}_${i}">
                    `).join('');

                    productElement.innerHTML = `
                        <div id="image-slider-trendyol-${index}" class="image-slider">
                            ${sliderImages}
                        </div>
                        <a href="${productUrl}" target="_blank">${product.name}</a>
                        <p>Price: ${product.price.sellingPrice}</p>
                    `;

                    resultsSection.appendChild(productElement);

                    const images = productElement.querySelectorAll(`#image-slider-trendyol-${index} img`);
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
});
