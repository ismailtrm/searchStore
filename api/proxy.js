const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const url = req.query.url;
  
  try {
    const response = await fetch(url);
    const data = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
};
