const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const { mockSongs } = require('../mockData');

// Get Recommendations by Mood
router.get('/recommendations', async (req, res) => {
    try {
        const { mood } = req.query;
        if (!mood) return res.status(400).json({ message: 'Mood is required' });

        // Mock Mode Support
        if (req.app.locals.useMock) {
            console.log('Serving from Mock DB');
            let songs = mockSongs.filter(s => s.mood === mood);
            // Fallback for demo purposes if mood empty in mock
            if (songs.length === 0) songs = mockSongs.filter(s => s.mood === 'Happy');
            return res.json(songs);
        }

        const songs = await Song.find({ mood });

        // If no songs found for specific mood, return random or default
        if (songs.length === 0) {
            const defaultSongs = await Song.find({ mood: 'Happy' });
            return res.json(defaultSongs);
        }

        res.json(songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get All Songs (Optional, for testing)
router.get('/', async (req, res) => {
    try {
        if (req.app.locals.useMock) {
            return res.json(mockSongs);
        }
        const songs = await Song.find();
        res.json(songs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
