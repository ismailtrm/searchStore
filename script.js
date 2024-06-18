document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchQuery = document.getElementById('search-query');
    const resultsSection = document.getElementById('results');

    searchButton.addEventListener('click', function() {
        const query = searchQuery.value;
        if (query.trim() !== "") {
            const url = `https://www.trendyol.com/sr?q=${query}`;
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
fetch(`${url}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.text();
  })
  .then(html => {
    // Parse the HTML content using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Select the section where the content will be inserted
    const contentSection = document.getElementById('content-section');
    
    // Clear existing content if any
    contentSection.innerHTML = '';

    // Append the new content
    contentSection.appendChild(doc.body);

    // Optionally, log the title of the fetched page
    const title = doc.querySelector('title').innerText;
    console.log('Fetched page title:', title);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
