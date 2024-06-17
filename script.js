document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchQuery = document.getElementById('search-query');
    const resultsSection = document.getElementById('results');

    const searchUrls = {
        'Trendyol': 'https://www.trendyol.com/sr?q=',
        'Mavi': 'https://www.mavi.com/s?q=',
        'H&M': 'https://www2.hm.com/tr_tr/search-results.html?q=',
        'Bershka': 'https://www.bershka.com/tr/search?searchText=',
        'Stradivarius': 'https://www.stradivarius.com/tr/search?text=',
        'Zara': 'https://www.zara.com/tr/en/search?searchTerm='
    };

    searchButton.addEventListener('click', function() {
        const query = searchQuery.value;
        resultsSection.innerHTML = '';

        for (const [site, baseUrl] of Object.entries(searchUrls)) {
            const url = `${baseUrl}${query}`;
            const resultDiv = document.createElement('div');
            resultDiv.innerHTML = `<h2>${site}</h2><p><a href="${url}" target="_blank">Arama Sonuçları</a></p>`;
            resultsSection.appendChild(resultDiv);
        }
    });
});
