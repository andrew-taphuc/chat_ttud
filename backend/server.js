// Backend: server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Replace this connection string with your actual MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://taphuc1:phucxxxx@ttud.0z7xz.mongodb.net/?retryWrites=true&w=majority&appName=ttud';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const messageSchema = new mongoose.Schema({
    content: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

app.get('/api', (req, res) => {
    res.send('API is running!');
});

app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const message = new Message({
            content: req.body.content
        });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/messages/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/messages', async (req, res) => {
    try {
        const { password } = req.body;
        // Replace 'your_password_here' with your chosen password
        if (password !== '1') {
            return res.status(401).json({ error: 'Invalid password' });
        }
        await Message.deleteMany({});
        res.status(200).json({ message: 'All messages deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});