
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchQuery = document.getElementById('search-query');
    const resultsSection = document.getElementById('results');

    // Bright Data proxy bilgileri
    const proxyUrl = ${{ secrets.BRIGHT_DATA_HOST }};
    const username = ${{ secrets.BRIGHT_DATA_USERNAME }}; // Bright Data kullanıcı adınız
    const password = ${{ secrets.BRIGHT_DATA_PASSWORD }}; // Bright Data şifreniz

    searchButton.addEventListener('click', function() {
        const query = searchQuery.value;
        const targetUrl = `https://www.trendyol.com/sr?q=${query}`;

        fetch(`${proxyUrl}/proxy/${apiKey}/${encodeURIComponent(targetUrl)}`, {
            headers: {
                'Proxy-Authorization': 'Basic ' + btoa(username + ':' + password)
            }
        })
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
                    <a href="${link}" target="_blank">Ürüne Git</a>
                `;
                resultsSection.appendChild(productDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsSection.innerHTML = `<p>Arama sonuçlarını alırken bir hata oluştu.</p>`;
        });
    });
});
