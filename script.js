document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchQuery = document.getElementById('search-query');
    const resultsSection = document.getElementById('results');

    searchButton.addEventListener('click', function() {
        const query = searchQuery.value;
        if (query.trim() !== "") {
            const url = `https://www.trendyol.com/sr?q=${query}`;
            fetch(`${url}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        // İçeriği seçilen bölüme ekleme
        const contentSection = document.getElementById('content-section');
        contentSection.innerHTML = `
          <h2>${data.title}</h2>
          <p>${data.body}</p>
        `;
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
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
