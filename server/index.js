const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "https://images.unsplash.com", "https://static.wikia.nocookie.net", "https://vignette.wikia.nocookie.net", "https://media.gettyimages.com", "https://*.gettyimages.com", "data:"],
    },
  },
}));
app.use(cors());
app.use(express.json());

const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

// Static files with clean URLs handling
app.use(express.static(path.join(__dirname, '../public'), {
  extensions: ['html']
}));

// Specific route mappings for clarity (optional since extensions: ['html'] handles it, but good for custom paths)
app.get('/levels', (req, res) => res.sendFile(path.join(__dirname, '../public/levels.html')));
app.get('/rewards', (req, res) => res.sendFile(path.join(__dirname, '../public/rewards.html')));

// API Routes
app.use('/api', apiRoutes);

// Fallback for character detail
app.get(['/characters/:id', '/characters/nolan'], (req, res) => {
  res.sendFile(path.join(__dirname, '../public/character-detail.html'));
});

// Season Hub Route
app.get('/season-:season', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/episodes.html'));
});

// Clean Episode Detail Route (e.g., /season-1/episode-1)
app.get('/season-:season/episode-:episode', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/episode-detail.html'));
});

// Legacy Fallback for episode detail (New Structure)
app.get(['/episodes/:id', '/episodes/s:season/e:episode'], (req, res) => {
  res.sendFile(path.join(__dirname, '../public/episode-detail.html'));
});

// 404 Fallback (Must be last)
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

app.listen(PORT, () => {
  console.log(`The Rookie Community Server running at http://localhost:${PORT}`);
});
