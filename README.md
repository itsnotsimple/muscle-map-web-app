# 💪 MuscleMap AI — Interactive Fitness Intelligence Platform

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-2.0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![AI](https://img.shields.io/badge/AI-Llama%203.1%20via%20Groq-orange)
![Vercel](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Koyeb-black?logo=vercel)

**MuscleMap AI** is a full-stack fitness intelligence platform that combines an interactive anatomical muscle map with an AI-powered personal coach. Users can explore muscle groups, discover targeted exercises, generate custom diet plans, track their BMI, and get real-time coaching from an AI trained to think like an elite gym coach.

---

## 🔥 Features

### 🗺️ Interactive Muscle Map
An SVG-based interactive anatomical model covering the full body. Click any muscle group to instantly explore curated exercises with GIF demonstrations, step-by-step instructions, difficulty levels, equipment requirements, and YouTube tutorial links.

### 🤖 MuscleMap AI Coach
A real-time AI chatbot powered by **Llama 3.1** (via Groq). The coach mirrors the user's language (English or Bulgarian), responds like a real gym coach, and is aware of premium user profiles to give tailored advice based on age, weight, and goals.
- **Free Tier:** 5 messages per rolling 24-hours.
- **MuscleMap Pro:** Unlimited messages and deep contextual context injection.

### 🥗 Custom Diet Plan Generator
Calculates daily caloric needs using the Harris-Benedict equation adjusted for activity level. Generates four structured diet blueprint plans: Balanced, High Protein, Ketogenic, and Low Fat — each with macro splits and recommended foods.

### 📏 BMI Tracker
Calculates and categorises Body Mass Index with personalised advice based on result (Underweight, Normal, Overweight, Obese).

### 🔖 Bookmark System
Save and manage favourite exercises to a personal collection. Bookmarks are stored per user account and accessible from any device.

### 🏆 Gamification & Badges
An achievement system that awards badges for platform milestones: first login (`Rookie`), email verification (`Verified`), completing a physical profile (`Nutrition Analyst`), saving 10+ exercises (`Librarian`), enabling dark mode (`Night Owl`), and switching to Bulgarian (`Bilingual`).

### 🌍 Bilingual Support (EN / BG)
Full app-wide localization using **i18next**. Every UI string — including the AI chatbot interface — switches seamlessly between English and Bulgarian.

### 🔐 Authentication
- Email/password registration with **email verification**
- Google OAuth login
- JWT-based session management
- Forgot/reset password via email link

### 💎 Premium Membership (Stripe)
A fully integrated Stripe checkout flow that unlocks **MuscleMap Pro**. Premium users receive:
- **Unlimited AI Coach Messages** (with deep physical profile context injected).
- **AI Custom Workout Generator** (Premium locked).
- **Unlimited Bookmarks** (Free users restricted to 10).
- Exclusive `Pro Athlete` user badge.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Component framework with type safety |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Pre-built accessible UI components |
| i18next | EN/BG localization |
| React Router v6 | Client-side routing |
| TanStack Query | Server state management |
| Lucide React | Icon library |
| ReactMarkdown | Renders AI markdown responses |
| react-markdown | Chatbot message formatting |
| @vercel/analytics | Page view tracking |
| @vercel/speed-insights | Performance monitoring |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | RESTful API server |
| MongoDB + Mongoose | User data, exercises, bookmarks |
| Groq SDK | Llama 3.1 inference for the AI coach |
| JWT | Authentication tokens |
| Nodemailer | Email verification & password reset |
| bcrypt | Password hashing |
| Stripe | Subscription & Checkout Sessions |
| CORS | Cross-origin resource control |

### Infrastructure
| Service | Role |
|---|---|
| **Vercel** | Frontend hosting + analytics |
| **Koyeb** | Backend hosting |
| **MongoDB Atlas** | Cloud database |
| **Groq** | AI inference API |
| **Stripe** | Payment processing |

---


---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key ([console.groq.com](https://console.groq.com))
- Stripe API key ([stripe.com](https://stripe.com))


### 1. Clone & install

```bash
git clone https://github.com/itsnotsimple/muscle-map-main.git
cd muscle-map-main
```

```bash
# Install frontend dependencies
cd client && npm install

# Install backend dependencies
cd ../server && npm install
```

### 2. Configure environment variables

Create `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_SERVICE=Gmail
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:8080 (or your production url)
```

### 3. Run the app

```bash
# Terminal 1 — Backend
cd server
node server.js

# Terminal 2 — Frontend
cd client
npm run dev
```

Frontend: `http://localhost:8080`  
Backend API: `http://localhost:5000/api`

---

## 🌐 Deployment

### Frontend → Vercel
The `client/` directory is deployed to Vercel. The production API URL is set in `client/src/services/api.ts`:

```ts
const API_URL = IS_LOCAL
  ? 'http://localhost:5000/api'
  : 'https://your-koyeb-backend.koyeb.app/api';
```

### Backend → Koyeb
The `server/` directory is deployed to Koyeb. Add all variables from `.env` as **Environment Variables** in the Koyeb dashboard — especially `GROQ_API_KEY`, which is required for the AI coach to function in production.

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/register` | ❌ | Register new user |
| POST | `/api/login` | ❌ | Login with email/password |
| POST | `/api/google` | ❌ | Google OAuth login |
| GET | `/api/verify/:token` | ❌ | Verify email address |
| POST | `/api/forgot-password` | ❌ | Send reset password email |
| POST | `/api/reset-password/:token` | ❌ | Reset password |
| GET | `/api/user/status` | ✅ | Get current user info |
| PUT | `/api/user/profile` | ✅ | Update physical profile |
| DELETE | `/api/user/profile` | ✅ | Delete account |
| PUT | `/api/user/badges` | ✅ | Award a badge |
| GET | `/api/user/bookmarks` | ✅ | Get saved exercises |
| POST | `/api/user/bookmark` | ✅ | Save an exercise |
| DELETE | `/api/user/bookmarks/:id` | ✅ | Remove a bookmark |
| GET | `/api/muscles/:key` | ❌ | Get exercises for a muscle |
| GET | `/api/diets` | ❌ | Get all diet plans |
| GET | `/api/chat/status` | ✅ | Get daily AI message limit status |
| POST | `/api/chat` | ✅ | Send message to AI coach |
| POST | `/api/stripe/create-checkout-session` | ✅ | Create Stripe checkout session |

---

## 📄 License

MIT © [itsnotsimple](https://github.com/itsnotsimple)
