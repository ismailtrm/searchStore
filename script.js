document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchQuery = document.getElementById('search-query');
    const resultsSection = document.getElementById('results');
    const productDetailsSection = document.getElementById('product-details');

    searchButton.addEventListener('click', function() {
        const query = searchQuery.value.trim();
        if (query !== "") {
            const url = `https://www.trendyol.com/sr?q=${query}`;
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const products = doc.querySelectorAll('.p-card-wrppr');

                    resultsSection.innerHTML = '';
                    products.forEach(product => {
                        const title = product.querySelector('.prdct-desc-cntnr-name').innerText.trim();
                        const price = product.querySelector('.prc-box-dscntd').innerText.trim();
                        const link = 'https://www.trendyol.com' + product.querySelector('a').getAttribute('href');

                        const productDiv = document.createElement('div');
                        productDiv.innerHTML = `
                            <h2>${title}</h2>
                            <p>${price}</p>
                            <a href="#" data-url="${link}" class="product-link">Detayları Göster</a>
                        `;
                        resultsSection.appendChild(productDiv);
                    });

                    // Ürün detaylarını gösterme linklerine click event listener ekleme
                    const productLinks = document.querySelectorAll('.product-link');
                    productLinks.forEach(link => {
                        link.addEventListener('click', function(event) {
                            event.preventDefault();
                            const productUrl = this.getAttribute('data-url');
                            showProductDetails(productUrl);
                        });
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    resultsSection.innerHTML = '<p>Arama sonuçlarını alırken bir hata oluştu.</p>';
                });
        } else {
            resultsSection.innerHTML = '<p>Lütfen arama yapmak için bir kelime girin.</p>';
        }
    });

    function showProductDetails(url) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');

                // Ürün detaylarından gerekli bilgileri çekme
                const productName = doc.querySelector('.pr-new-br').innerText.trim();
                const productPrice = doc.querySelector('.prc-slg').innerText.trim();
                const productImage = doc.querySelector('.primary-img').getAttribute('src');

                // Detayları göster
                productDetailsSection.innerHTML = `
                    <div>
                        <h2>${productName}</h2>
                        <p>Fiyat: ${productPrice}</p>
                        <img src="${productImage}" alt="${productName}" style="max-width: 100%;">
                    </div>
                `;
                productDetailsSection.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
                productDetailsSection.innerHTML = '<p>Ürün detaylarını alırken bir hata oluştu.</p>';
                productDetailsSection.style.display = 'block';
            });
    }
});
