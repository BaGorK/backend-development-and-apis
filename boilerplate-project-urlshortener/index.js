require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const shortid = require('shortid');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

// In-memory storage for URLs
const urlDatabase = {};

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// API Endpoint to shorten URLs
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validate URL
  try {
    new URL(originalUrl);
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(new URL(originalUrl).hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Create a short URL ID
    const shortUrlId = shortid.generate();
    urlDatabase[shortUrlId] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrlId,
    });
  });
});

// API Endpoint to redirect short URLs
app.get('/api/shorturl/:shorturl', (req, res) => {
  const shortUrlId = req.params.shorturl;
  const originalUrl = urlDatabase[shortUrlId];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'no short url found for the given input' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
