require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const historyRoutes = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Body parser
app.use(express.json());

// Multer setup - store files in /tmp
const upload = multer({ dest: '/tmp' });

// Multer middleware for transcribe route
app.post('/api/transcribe', upload.single('audio'));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api', aiRoutes);
app.use('/api/history', historyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`MedNote AI server running on port ${PORT}`);
});
