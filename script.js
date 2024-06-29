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

const url = `https://cors-anywhere.herokuapp.com/corsdemo`;

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
    // Create a new DOM parser
    const parser = new DOMParser();
    // Parse the HTML string into a document
    const doc = parser.parseFromString(html, 'text/html');
    // Find the hidden input element
    const hiddenInput = doc.querySelector('input[name="accessRequest"]');
    if (hiddenInput) {
        // Get the value of the hidden input
        const hiddenValue = hiddenInput.value;
        console.log('Hidden input value:', hiddenValue);
        
        // Use the hiddenValue to make another fetch request
        const sUrl = `https://cors-anywhere.herokuapp.com/corsdemo?accessRequest=${hiddenValue}`;
        return fetch(sUrl, {
            headers: {
                'Origin': 'https://search-store.vercel.app/'
            },
            mode: 'cors'
        });
    } else {
        console.log('Hidden input not found');
        throw new Error('Hidden input not found');
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.text();
})
.then(data => {
    // Handle the response of the second fetch request
    console.log('Response from second request:', data);
})
.catch(error => {
    console.error('Fetch error:', error);
});

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
