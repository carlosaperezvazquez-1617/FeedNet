const express = require('express');
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;