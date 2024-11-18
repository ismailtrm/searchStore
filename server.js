const express = require('express');
const scraper = require('./scraper');
const cors = require('cors'); // Optional for frontend communication

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for development (optional)
app.use(express.json());

// Route: Fetch scraped data
app.get('/scrape', async (req, res) => {
    try {
        const data = await scraper.scrapeWebsite(); // Call scraper
        res.json({ success: true, data });
    } catch (error) {
        console.error('Scraping failed:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});