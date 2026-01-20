const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CHAR_FILE = path.join(__dirname, '../data/characters.json');
const EPISODE_FILE = path.join(__dirname, '../data/episodes.json');

// Helper to read JSON
const readJson = (file) => {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

// --- Character Routes ---
router.get('/characters', (req, res) => {
    const characters = readJson(CHAR_FILE);
    res.json(characters);
});

router.get('/characters/:id', (req, res) => {
    const characters = readJson(CHAR_FILE);
    const character = characters.find(c => c.id === req.params.id);
    if (character) {
        res.json(character);
    } else {
        res.status(404).json({ error: 'Officer not found' });
    }
});

// --- Episode Routes ---
router.get('/episodes', (req, res) => {
    const episodes = readJson(EPISODE_FILE);
    res.json(episodes);
});

router.get('/episodes/:id', (req, res) => {
    const episodes = readJson(EPISODE_FILE);
    const episode = episodes.find(e => e.id === req.params.id);
    if (episode) {
        res.json(episode);
    } else {
        res.status(404).json({ error: 'Case file not found' });
    }
});

module.exports = router;
