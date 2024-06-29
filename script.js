

var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
function doCORSRequest(options, printResult) {
  var x = new XMLHttpRequest();
  x.open(options.method, cors_api_url + options.url);
  x.onload = x.onerror = function() {
    printResult(
      options.method + ' ' + options.url + '\n' +
      x.status + ' ' + x.statusText + '\n\n' +
      (x.responseText || '')
    );
  };

// Bind event
(function() {
  var urlField = 'https://cors-anywhere.herokuapp.com/corsdemo';
  document.getElementById('search-button').onclick = function(e) {
    e.preventDefault();
    doCORSRequest({
      method: 'GET',
      url: urlField.value,
    }, function printResult(result) {
      const output = result;
    });
  };
})();

console.log(`${output}`)

if (typeof console === 'object') {
  console.log('// To test a local CORS Anywhere server, set cors_api_url. For example:');
  console.log('cors_api_url = "http://localhost:8080/"');
}

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
})};
