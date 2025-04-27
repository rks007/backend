const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
})

db.on('error', (error) => {
    console.log('MongoDB connection error', error);
})

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
})

module.exports = db;