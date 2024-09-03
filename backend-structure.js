const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());

// Connect to database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define models
const User = mongoose.model('User', {
    username: String,
    password: String,
    isSubscribed: Boolean,
    trialEndDate: Date
});

const MediaItem = mongoose.model('MediaItem', {
    title: String,
    description: String,
    type: String,
    src: String,
    image: String
});

const Comment = mongoose.model('Comment', {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: Date
});

// Routes
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: 'User created successfully' });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});

app.get('/api/media-items', async (req, res) => {
    const mediaItems = await MediaItem.find();
    res.json(mediaItems);
});

app.post('/api/start-trial', async (req, res) => {
    // Implement trial logic
    res.json({ message: 'Trial started successfully' });
});

app.post('/api/subscribe', async (req, res) => {
    // Implement subscription logic with Stripe
    res.json({ message: 'Subscribed successfully' });
});

app.post('/api/donate', async (req, res) => {
    // Implement donation logic with Stripe
    res.json({ message: 'Thank you for your donation!' });
});

app.post('/api/send-message', async (req, res) => {
    // Implement message handling
    res.json({ message: 'Message sent successfully' });
});

app.post('/api/post-comment', async (req, res) => {
    // Implement comment posting
    res.json({ message: 'Comment posted successfully' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
