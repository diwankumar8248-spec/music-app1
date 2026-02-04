const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Song = require('../models/Song');

dotenv.config({ path: '../.env' }); // Adjust path if needed

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mood_matcher', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.log(err));

const songs = [
    // Happy
    { title: 'Walking On Sunshine', artist: 'Katrina & The Waves', mood: 'Happy', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', art: 'https://images.unsplash.com/photo-1542321473-b3bc4f526ca9?w=300' },
    { title: 'Happy', artist: 'Pharrell Williams', mood: 'Happy', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', art: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300' },

    // Melancholy
    { title: 'Someone Like You', artist: 'Adele', mood: 'Melancholy', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', art: 'https://images.unsplash.com/photo-1499364615650-ec3872055f2d?w=300' },

    // Chill
    { title: 'Weightless', artist: 'Marconi Union', mood: 'Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', art: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300' },

    // Focused
    { title: 'River Flows In You', artist: 'Yiruma', mood: 'Focused', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', art: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300' },

    // Energetic
    { title: 'Eye of the Tiger', artist: 'Survivor', mood: 'Energetic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', art: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300' },

    // Romantic
    { title: 'All of Me', artist: 'John Legend', mood: 'Romantic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', art: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=300' }
];

const seedDB = async () => {
    try {
        await Song.deleteMany({});
        await Song.insertMany(songs);
        console.log('Database Seeded!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
