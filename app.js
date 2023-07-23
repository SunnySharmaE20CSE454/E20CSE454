const express = require("express");
const axios = require("axios");

const app = express();
const port = 8008;

// GET /numbers endpoint
app.get("/numbers", async (req, res) => {
  const urls = req.query.url;

  if (!urls) {
    return res.status(400).json({
      error: 'Please provide at least one URL in the "url" query parameter.',
    });
  }

  const urlArray = Array.isArray(urls) ? urls : [urls];

  try {
    const responses = await axios.all(urlArray.map(url => axios.get(url, { timeout: 500 })));

    const numbers = responses
      .filter(response => response && Array.isArray(response.data.numbers))
      .flatMap(response => response.data.numbers);

    const uniqueNumbers = Array.from(new Set(numbers)).sort((a, b) => a - b);

    res.json({ numbers: uniqueNumbers });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Error fetching data from one or more URLs." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
