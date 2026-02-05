require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- ИМПОРТИРАМЕ ОТДЕЛНИТЕ ФАЙЛОВЕ ---
const authRoutes = require('./routes/auth');      // Тук е User логиката + триенето
const muscleRoutes = require('./routes/muscles'); // Тук е логиката за тренировките

const app = express();
const PORT = process.env.PORT || 5000;

// Настройки
app.use(cors({
  origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
  credentials: true
}));
app.use(express.json());

// --- ВРЪЗВАМЕ РУТОВЕТЕ ---
// Всичко отива под /api prefix
app.use('/api', authRoutes);    // http://localhost:5000/api/register ...
app.use('/api', muscleRoutes);  // http://localhost:5000/api/muscles/chest ...

// Връзка с базата
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/musclewiki')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));