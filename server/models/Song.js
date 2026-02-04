const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        required: true,
        enum: ['Happy', 'Melancholy', 'Chill', 'Focused', 'Energetic', 'Romantic']
    },
    url: {
        type: String,
        required: true
    },
    art: {
        type: String
    }
});

module.exports = mongoose.model('Song', SongSchema);
