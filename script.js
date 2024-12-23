document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('search-button');
  const searchQuery = document.getElementById('search-query');
  const resultsSection = document.getElementById('results');
  const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';

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
  const url = `${corsApiUrl}${targetUrl}`;

  fetch(url, {
    headers: {
      'Origin': window.location.origin,
      'x-requested-with': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br'
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
      const scriptRegex = /<script type="application\/javascript">[\s\S]*?window\.__SEARCH_APP_INITIAL_STATE__=([\s\S]*?);\n/;
      const match = html.match(scriptRegex);

      if (match && match[1]) {
        const jsonString = match[1];

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
      resultsSection.innerHTML = `<p>Trendyol'dan veri alınırken bir hata oluştu: ${error.message}. Lütfen daha sonra tekrar deneyin.</p>`;
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
