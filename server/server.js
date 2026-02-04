const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mood_matcher', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s
    });
    console.log('MongoDB Connected');
    app.locals.useMock = false;
  } catch (err) {
    console.error('MongoDB Connection Failed (Using Mock Data):', err.message);
    app.locals.useMock = true;
  }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/songs'));

app.get('/', (req, res) => {
  res.send('Mood Music Matcher API Running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
