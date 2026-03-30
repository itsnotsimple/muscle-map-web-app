require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const rateLimit = require('express-rate-limit');

// Форсираме Node.js да използва Google DNS (8.8.8.8)
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.log("DNS Override warning:", e);
}

// --- ИМПОРТИРАМЕ ОТДЕЛНИТЕ ФАЙЛОВЕ ---
const authRoutes = require('./routes/auth');
const muscleRoutes = require('./routes/muscles');
const dietRoutes = require('./routes/diets');
const chatRoutes = require('./routes/chat');
const workoutRoutes = require('./routes/workout');
const contactRoutes = require('./routes/contact');
const { checkoutRoute, webhookRoute } = require('./routes/stripe');

const app = express();
const PORT = process.env.PORT || 5000;

// --- RATE LIMITING ---
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минути
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 опита за логин/регистрация на 15 мин
  message: { message: "Too many authentication attempts. Please try again later." }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 5, // 5 AI заявки на минута
  message: { message: "AI rate limit reached. Please wait a moment." }
});

// --- CORS ---
app.use(cors({
  origin: ["http://localhost:8080", "http://127.0.0.1:8080", "https://muscle-map-main.vercel.app"],
  credentials: true
}));

// Webhook must use express.raw BEFORE express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), webhookRoute);

app.use(express.json());
app.use('/api', generalLimiter);

// Auth — строг лимит за brute-force защита
app.use('/api/register', authLimiter);
app.use('/api/login', authLimiter);
app.use('/api/forgot-password', authLimiter);

// AI — отделен лимит
app.use('/api/chat', aiLimiter);
app.use('/api/workout', aiLimiter);

// Contact — ограничение срещу спам
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: "Too many messages sent. Please try again later." }
});
app.use('/api/contact', contactLimiter);

// --- ROUTES ---
app.use('/api', authRoutes);
app.use('/api', muscleRoutes);
app.use('/api', dietRoutes);
app.use('/api', chatRoutes);
app.use('/api', workoutRoutes);
app.use('/api', contactRoutes);
app.use('/api/stripe', checkoutRoute);

// Връзка с базата
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/musclewiki', {
  family: 4
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(`❌ MongoDB Error ${process.env.MONGO_URI}:`, err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));