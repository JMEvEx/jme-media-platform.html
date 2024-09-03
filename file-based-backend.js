const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const dataFile = path.join(__dirname, 'data.json');

// Function to read data from file
async function readData() {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        return [];
    }
}

// Function to write data to file
async function writeData(data) {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

// Route to get all media items
app.get('/api/media-items', async (req, res) => {
    const mediaItems = await readData();
    res.json(mediaItems);
});

// Route to add a new media item
app.post('/api/media-items', async (req, res) => {
    const mediaItems = await readData();
    const newItem = req.body;
    mediaItems.push(newItem);
    await writeData(mediaItems);
    res.status(201).json(newItem);
});

// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
