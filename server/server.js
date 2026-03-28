require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');

// Форсираме Node.js да използва Google DNS (8.8.8.8), за да заобиколи филтъра на доставчика ти за SRV записи!
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.log("DNS Override warning:", e);
}

// --- ИМПОРТИРАМЕ ОТДЕЛНИТЕ ФАЙЛОВЕ ---
const authRoutes = require('./routes/auth');      // Тук е User логиката + триенето
const muscleRoutes = require('./routes/muscles'); // Тук е логиката за тренировките
const dietRoutes = require('./routes/diets');     // Логика за диетите
const chatRoutes = require('./routes/chat');      // Groq Chatbot логика
const { checkoutRoute, webhookRoute } = require('./routes/stripe'); // Stripe payments

const app = express();
const PORT = process.env.PORT || 5000;

// Настройки
app.use(cors({
  origin: ["http://localhost:8080", "http://127.0.0.1:8080", "https://muscle-map-main.vercel.app"],
  credentials: true
}));
// Всичко отива под /api prefix

// Webhook must use express.raw BEFORE express.json() parses it globally
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), webhookRoute);

app.use(express.json());

app.use('/api', authRoutes);    // http://localhost:5000/api/register ...
app.use('/api', muscleRoutes);  // http://localhost:5000/api/muscles/chest ...
app.use('/api', dietRoutes);    // http://localhost:5000/api/diets
app.use('/api', chatRoutes);    // http://localhost:5000/api/chat
app.use('/api/stripe', checkoutRoute); // http://localhost:5000/api/stripe/create-checkout-session

// Връзка с базата
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/musclewiki', {
  family: 4 // Форсира IPv4 за Node.js 17+, за да не гърми на SRV records
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(`❌ MongoDB Error ${process.env.MONGO_URI}:`, err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));