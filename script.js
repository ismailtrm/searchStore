document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchQuery = document.getElementById('search-query');
    const resultsSection = document.getElementById('results');
    //const proxyUrl = 'https://search-store.vercel.app/api/proxy?url=';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    
    searchButton.addEventListener('click', function() {
        const query = searchQuery.value;
        if (query.trim() !== "") {
            const url = `https://www.trendyol.com/sr?q=${encodeURIComponent(query)}`;
            
fetch(proxyUrl + url, {
    headers: {
        'Origin': 'https://search-store.vercel.app/', // Replace with your actual domain
        // 'X-Requested-With': 'XMLHttpRequest' // Uncomment if needed
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
                    // <script> içeriği bulundu, şimdi bunu gösterelim
                    const scriptContent = match[1];
                    const veri = JSON.parse(scriptContent);
                    const contentSection = document.getElementById('content-section');
                    console.log(`${veri.products}`);
                    resultsSection.innerHTML = `
                    <div>
                    <p>${veri.products}</p>
                    </div>
                                                `;
        
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    resultsSection.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
    console.log(proxyUrl + encodeURIComponent(url))
});
            
            resultsSection.innerHTML = `
                <div>
                    <h2>Trendyol</h2>
                    <p><a href="${url}" target="_blank">Arama Sonuçları</a></p>
                </div>
            `;
        } else {
            resultsSection.innerHTML = '<p>Lütfen arama yapmak için bir kelime girin.</p>';
        }
    });
});

// Fetch the URL
