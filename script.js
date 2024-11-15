const url = 'https://cors-anywhere.herokuapp.com/corsdemo';

fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data); // Gelen veriyi işle
  })
  .catch(error => {
    console.error('Hata:', error);
  });

const corsApiUrl = 'https://cors-anywhere.herokuapp.com/corsdemo';

function doCORSRequest(options) {
  return fetch(corsApiUrl + options.url, {
    method: 'GET',
    headers: options.headers,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => data)
    .catch(error => {
      throw new Error(error.message);
    });
}

const options = {
  url: 'view-source:https://cors-anywhere.herokuapp.com/corsdemo', // hedef URL
  headers: {
    'Content-Type': 'application/json',
    // Diğer gerekli başlıklar
  },
};

doCORSRequest(options)
  .then(response => console.log(response))
  .catch(error => console.error('Error:', error));


document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('search-button');
  const searchQuery = document.getElementById('search-query');
  const resultsSection = document.getElementById('results');

  searchButton.addEventListener('click', function (e) {
    e.preventDefault();
    const query = searchQuery.value.trim();

    if (query !== "") {
      fetchTrendyolData(query);
    } else {
      resultsSection.innerHTML = '<p>Lütfen arama yapmak için bir kelime girin.</p>';
    }
  });

  function fetchTrendyolData(query) {
    const targetUrl = `https://www.trendyol.com/sr?q=${encodeURIComponent(query)}`;
    const url = `${cors_api_url}${targetUrl}`;

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

          resultsSection.innerHTML = ''; // Clear previous results
          resultsSection.className = 'column-container single-column';

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
        resultsSection.innerHTML = '<p>Trendyol\'dan veri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>';
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
      <p>Fiyat: ${product.price.sellingPrice}</p>
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
