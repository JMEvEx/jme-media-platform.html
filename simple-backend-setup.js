const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define a simple schema for media items
const MediaItem = mongoose.model('MediaItem', new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  src: String,
  image: String
}));

// Route to get all media items
app.get('/api/media-items', async (req, res) => {
  const mediaItems = await MediaItem.find();
  res.json(mediaItems);
});

// Serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
