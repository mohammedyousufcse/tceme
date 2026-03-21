const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dns = require('dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
// app.use(express.static(path.join(__dirname, '../client')))/\;

// MongoDB
const MONGO_URI = 'mongodb+srv://mohammedyf786_db_user:qqbCtQVWgfJORXhz@tceme.zsjllke.mongodb.net/tceme?appName=tceme';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes - students only
app.use('/api/students', require('./routes/students'));

// Fallback to index.html
app.get('/', (req, res) => {
   res.send('Backend is running...');
 });

const PORT = process.env.PORT||3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
