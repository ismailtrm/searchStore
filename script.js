const getUAData = async () => {
    let uaData = {};
    if (navigator.userAgentData) {
        uaData = await navigator.userAgentData.getHighEntropyValues(['sec-ch-ua', 'sec-ch-ua-platform']);
    }
    return uaData;
};

const fetchCorsDemo = async () => {
    const uaData = await getUAData();

    const url = `https://cors-anywhere.herokuapp.com/corsdemo`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8,en-US;q=0.7',
                'Connection': 'keep-alive',
                'User-Agent': navigator.userAgent,
                'sec-ch-ua': uaData['sec-ch-ua'] || '',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': uaData['sec-ch-ua-platform'] || '',
                'Origin': 'https://search-store.vercel.app/', // Added Origin header
                'x-requested-with': 'XMLHttpRequest' // Added x-requested-with header
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        let html = await response.text();
        html = html.replace('GET https://cors-anywhere.herokuapp.com/corsdemo', '');
        html = html.replace('403 Forbidden', '');

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const hiddenInput = doc.querySelector('input[name="accessRequest"]');
        if (hiddenInput) {
            const hiddenValue = hiddenInput.value;

            const sUrl = `https://cors-anywhere.herokuapp.com/corsdemo?accessRequest=${hiddenValue}`;
            const secondResponse = await fetch(sUrl, {
                headers: {
                    'Origin': 'https://search-store.vercel.app/', // Added Origin header
                    'x-requested-with': 'XMLHttpRequest' // Added x-requested-with header
                },
                mode: 'cors'
            });

            if (!secondResponse.ok) {
                throw new Error('Network response was not ok ' + secondResponse.statusText);
            }

            const data = await secondResponse.text();
            console.log('Response from second request:', data);
        } else {
            throw new Error('Hidden input not found');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

fetchCorsDemo();

(function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';

    // Original fetch function reference
    var originalFetch = window.fetch;

    // Override fetch function
    window.fetch = function() {
        var args = [].slice.call(arguments);
        var url = args[0];
        var options = args[1] || {};

        // Check if the request URL matches the target origin
        if (/^https?:\/\/([^\/]+)/i.test(url)) {
            // Modify the URL to go through the CORS proxy if it's not from the same origin or the CORS proxy itself
            if (RegExp.$1.toLowerCase() !== window.location.host.split(':')[0] && RegExp.$1 !== cors_api_host) {
                args[0] = cors_api_url + url;
                // Ensure CORS headers are added
                options.mode = 'cors';
                options.headers = options.headers || {};
                options.headers['X-Requested-With'] = 'fetch';
                options.headers['Origin'] = window.location.origin; 
                options.headers['User-Agent'] = navigator.userAgent; // Add any other headers as needed
            }
        }

        // Call the original fetch function with modified arguments
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
        }
    };

    searchButton.addEventListener('click', function() {
        const query = searchQuery.value.trim();
        const selectedSources = Object.keys(dataSources).filter(source => document.getElementById(dataSources[source].checkboxId).checked);
        
        if (query !== "" && selectedSources.length > 0) {
            resultsSection.innerHTML = ''; // Clear previous results
            resultsSection.className = 'column-container single-column';

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
            mode: 'cors' 
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
            resultsSection.innerHTML = '<p>An error occurred while fetching data from Trendyol. Please try again later.</p>';
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
