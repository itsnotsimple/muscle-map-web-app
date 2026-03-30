# 🏋️ Muscle Map — Пълна Техническа Документация

## 📋 Обзор на проекта

**Muscle Map** е AI-базирана уеб платформа за фитнес, която комбинира интерактивна анатомична карта, AI чатбот, персонализирани тренировъчни планове, калкулатор за калории/BMI и система за gamification. Платформата поддържа Premium модел чрез Stripe и е двуезична (EN/BG).

---

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Client)                     │
│              React + TypeScript + Vite                    │
│           Deployed: Vercel (muscle-map-main)             │
├─────────────────────────────────────────────────────────┤
│                         ↕ REST API                       │
├─────────────────────────────────────────────────────────┤
│                    BACKEND (Server)                       │
│              Node.js + Express.js                        │
│           Deployed: Koyeb                                │
├─────────────────────────────────────────────────────────┤
│                      ↕                ↕                  │
│               MongoDB Atlas      Groq AI (LLaMA)         │
│            (база данни)       (AI chatbot & plans)       │
└─────────────────────────────────────────────────────────┘
```

### Технологичен стек

| Слой | Технология | Цел |
|------|-----------|-----|
| **Frontend** | React 18 + TypeScript | UI framework |
| **Build Tool** | Vite 5 | Бърз dev server & build |
| **Styling** | TailwindCSS 4 | Utility-first CSS |
| **State** | React Query (TanStack) | Server state management |
| **Routing** | React Router v6 | Client-side routing |
| **i18n** | i18next | Двуезичност (EN/BG) |
| **Animations** | ReactBits (custom) | Scroll, tilt, aurora effects |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB + Mongoose | NoSQL database |
| **AI** | Groq API (LLaMA 3) | Chatbot & workout generation |
| **Payments** | Stripe | Premium subscriptions |
| **Email** | Nodemailer + Gmail SMTP | Transactional emails |
| **Auth** | JWT + bcrypt + Google OAuth | Authentication |
| **Analytics** | Vercel Analytics + Speed Insights | Performance tracking |

---

## 📁 Файлова Структура

```
muscle-map-main/
├── client/                          # FRONTEND
│   ├── src/
│   │   ├── App.tsx                  # Главен компонент — всичките Route-ове
│   │   ├── main.tsx                 # Entry point
│   │   ├── pages/
│   │   │   ├── app/                 # Основни страници на приложението
│   │   │   │   ├── Index.tsx        # Landing page (начална страница)
│   │   │   │   ├── Exercises.tsx    # Списък с мускулни групи
│   │   │   │   ├── MuscleDetail.tsx # Детайли за конкретен мускул + упражнения
│   │   │   │   ├── Bookmarks.tsx    # Запазени упражнения
│   │   │   │   ├── Profile.tsx      # Профил + физически данни + настройки
│   │   │   │   ├── BmiPage.tsx      # BMI калкулатор
│   │   │   │   ├── DietPlan.tsx     # Калории & макронутриенти & хранителен план
│   │   │   │   ├── Premium.tsx      # Страница за Premium абонамент
│   │   │   │   └── WorkoutPlanner.tsx # AI тренировъчен план генератор
│   │   │   ├── auth/                # Автентикация
│   │   │   │   ├── Login.tsx        # Вход (email/password + Google OAuth)
│   │   │   │   ├── Register.tsx     # Регистрация
│   │   │   │   ├── VerifyEmail.tsx  # Email верификация (от линк в имейла)
│   │   │   │   ├── ForgotPassword.tsx # Забравена парола (въвеждане на email)
│   │   │   │   └── ResetPassword.tsx  # Нова парола (от линк в имейла)
│   │   │   └── static/             # Статични/правни страници
│   │   │       ├── Terms.tsx        # Условия за ползване
│   │   │       ├── PrivacyPolicy.tsx # Политика за поверителност
│   │   │       ├── CookiePolicy.tsx # Политика за бисквитки
│   │   │       ├── RefundPolicy.tsx # Политика за възстановяване
│   │   │       ├── FAQ.tsx          # Често задавани въпроси
│   │   │       ├── Contact.tsx      # Контактна форма (свързана с backend)
│   │   │       ├── About.tsx        # За нас
│   │   │       └── NotFound.tsx     # 404 страница
│   │   ├── components/
│   │   │   ├── features/            # Функционални компоненти
│   │   │   │   ├── Chatbot.tsx      # AI фитнес чатбот (плаващ бутон)
│   │   │   │   ├── InteractiveMuscleMap.tsx # SVG анатомична карта
│   │   │   │   ├── MuscleInfoCard.tsx      # Карта с информация за мускул
│   │   │   │   ├── BadgesDisplay.tsx       # Значки (gamification)
│   │   │   │   ├── GamificationEngine.tsx  # Логика за значки/постижения
│   │   │   │   └── UserPreferenceSync.tsx  # Синхронизация на theme/language
│   │   │   ├── layout/              # Layout компоненти
│   │   │   │   ├── Header.tsx       # Навигационен header
│   │   │   │   ├── Footer.tsx       # Footer с правни линкове (| разделители)
│   │   │   │   └── theme-provider.tsx # Dark/Light mode provider
│   │   │   ├── ui/                  # UI компоненти
│   │   │   │   ├── CookieBanner.tsx  # GDPR cookie consent банер
│   │   │   │   ├── GoogleIcon.tsx    # Google OAuth иконка
│   │   │   │   ├── LanguageToggle.tsx # EN/BG превключвател
│   │   │   │   └── ThemeToggle.tsx   # Dark/Light mode бутон
│   │   │   └── reactbits/           # Анимационни компоненти
│   │   │       ├── AnimatedContent.tsx # Fade-in при скрол
│   │   │       ├── ScrollFloat.tsx    # Floating text при скрол
│   │   │       ├── TiltedCard.tsx     # 3D tilt ефект при hover
│   │   │       ├── SpotlightCard.tsx  # Mouse spotlight ефект
│   │   │       ├── CountUp.tsx        # Анимирано число (брояч)
│   │   │       ├── CardNav.tsx        # Navigation cards
│   │   │       └── SoftAurora.tsx     # Фонов aurora ефект (WebGL)
│   │   ├── services/
│   │   │   └── api.ts               # Централизиран API service (fetch wrapper)
│   │   ├── locales/
│   │   │   ├── en/translation.json  # Английски преводи
│   │   │   └── bg/translation.json  # Български преводи
│   │   └── utils/
│   │       └── computeTDEE.ts       # TDEE/BMR калкулации
│   └── vite.config.ts               # Vite конфигурация (port 8080, proxy)
│
├── server/                          # BACKEND
│   ├── server.js                    # Entry point — Express app, middleware, routes
│   ├── controllers/                 # Бизнес логика (MVC pattern)
│   │   ├── authController.js        # Register, Login, Google OAuth, Verify, Reset
│   │   ├── chatController.js        # AI chatbot (Groq API)
│   │   ├── muscleController.js      # CRUD за мускулни данни
│   │   ├── dietController.js        # Хранителни планове от DB
│   │   └── workoutController.js     # AI workout plan генератор
│   ├── routes/                      # Express роутове
│   │   ├── auth.js                  # /api/register, /login, /verify, /forgot-password...
│   │   ├── chat.js                  # /api/chat
│   │   ├── muscles.js               # /api/muscles, /api/muscles/:key
│   │   ├── diets.js                 # /api/diets
│   │   ├── workout.js               # /api/workout/generate, /api/workout/plans
│   │   ├── contact.js               # /api/contact (Contact форма → email)
│   │   └── stripe.js                # /api/stripe/checkout, /api/stripe/webhook
│   ├── models/                      # Mongoose модели (MongoDB схеми)
│   │   ├── User.js                  # Потребител
│   │   ├── Muscle.js                # Мускулна група + упражнения
│   │   ├── Diet.js                  # Хранителен план
│   │   └── WorkoutPlan.js           # AI генериран тренировъчен план
│   └── utils/
│       ├── sendEmail.js             # Nodemailer wrapper (Gmail SMTP)
│       └── authMiddleware.js        # JWT верификация middleware
└── .env                             # Environment variables
```

---

## 🔐 Автентикация — Как работи

### Регистрация (Local)
```
1. Потребител въвежда email + password
2. Backend: bcrypt.genSalt(10) → bcrypt.hash(password)
3. Генерира verificationToken (crypto.randomBytes)
4. Записва User в MongoDB (isVerified: false)
5. Изпраща Verify Email чрез Gmail SMTP
6. Потребител кликва линк → /verify/:token → isVerified = true
```

### Регистрация (Google OAuth)
```
1. Потребител кликва "Sign in with Google"
2. Google OAuth дава id_token
3. Backend: декодира токена → взема email + name
4. Ако потребителят не съществува → създава го (authProvider: 'google')
5. Издава JWT token → връща го на frontend
```

### Login
```
1. POST /api/login → email + password
2. Backend: bcrypt.compare(password, user.password)
3. Ако match → jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
4. Frontend: записва token в localStorage
5. Всяка API заявка: Authorization: Bearer <token>
```

### Password Reset
```
1. POST /api/forgot-password → { email }
2. Backend: генерира resetToken, записва го в user, праща email
3. Потребител кликва линк → /reset-password/:token
4. POST /api/reset-password/:token → { password }
5. Ако токенът е валиден и не е изтекъл (5 мин) → bcrypt.hash → save
```

### JWT Middleware ([authMiddleware.js](file:///d:/project/muscle-map-main/muscle-map-main/server/utils/authMiddleware.js))
```javascript
// Всяка защитена заявка минава през authenticateToken:
// 1. Взема header: Authorization: Bearer <token>
// 2. jwt.verify(token, JWT_SECRET) → ако е валиден, req.user = decoded
// 3. Ако е невалиден/изтекъл → 401 → frontend auto-logout
```

---

## 🗄️ База данни — MongoDB Модели

### [User.js](file:///d:/project/muscle-map-main/muscle-map-main/server/models/User.js)
| Поле | Тип | Описание |
|------|-----|----------|
| `email` | String (unique) | Email адрес |
| `password` | String | bcrypt hash |
| `isVerified` | Boolean | Email верифициран ли е |
| `authProvider` | 'local' / 'google' | Метод на регистрация |
| `isPremium` | Boolean | Premium абонамент |
| `stripeCustomerId` | String | Stripe клиент ID |
| `aiMessageCount` | Number | Брой AI съобщения днес |
| `aiMessageDate` | Date | Дата на последно AI съобщение |
| `theme` | String | 'system' / 'dark' / 'light' |
| `language` | 'en' / 'bg' | Предпочитан език |
| `physicalProfile` | Object | age, gender, height, weight, activityLevel |
| `savedExercises` | Array | Bookmark-нати упражнения |
| `unlockedBadges` | [String] | Отключени значки |

### [Muscle.js](file:///d:/project/muscle-map-main/muscle-map-main/server/models/Muscle.js)
| Поле | Тип | Описание |
|------|-----|----------|
| `key` | String (unique) | Идентификатор (напр. "chest") |
| `title` | String | Име на мускулна група |
| `subTitle` | String | Подзаглавие |
| `exercises` | Array | Масив от упражнения (name, text, difficulty, equipment, location, steps, gif, youtubeUrl) |

### [WorkoutPlan.js](file:///d:/project/muscle-map-main/muscle-map-main/server/models/WorkoutPlan.js)
| Поле | Тип | Описание |
|------|-----|----------|
| `userId` | ObjectId → User | Кой потребител |
| `goal` | String | "Muscle Gain" / "Weight Loss" / "Maintenance" |
| `days` | Number | 3–6 дни |
| `level` | String | "Beginner" / "Intermediate" / "Advanced" |
| `plan` | [DaySchema] | Масив от дни (dayNumber, focus, exercises[]) |
| `recoveryTips` | [String] | Съвети за възстановяване |

### [Diet.js](file:///d:/project/muscle-map-main/muscle-map-main/server/models/Diet.js)
| Поле | Тип | Описание |
|------|-----|----------|
| `identifier` | String | "balanced" / "keto" / "high_protein" |
| `name` | String | Име на диетата |
| `macroSplit` | Object | protein%, carbs%, fats% |
| `goodFoods` | [String] | Препоръчани храни |

---

## 🌐 API Endpoints

### Auth Routes ([auth.js](file:///d:/project/muscle-map-main/muscle-map-main/server/routes/auth.js))
| Method | Endpoint | Auth? | Описание |
|--------|----------|-------|----------|
| POST | `/api/register` | ❌ | Регистрация (email + password) |
| POST | `/api/login` | ❌ | Вход → JWT token |
| POST | `/api/google-login` | ❌ | Google OAuth вход |
| GET | `/api/verify/:token` | ❌ | Email верификация |
| POST | `/api/forgot-password` | ❌ | Изпраща reset email |
| POST | `/api/reset-password/:token` | ❌ | Задава нова парола |
| GET | `/api/profile` | ✅ JWT | Взема профил данни |
| PUT | `/api/profile` | ✅ JWT | Обновява профил |
| DELETE | `/api/delete-account` | ✅ JWT | Изтрива акаунт |
| POST | `/api/bookmark` | ✅ JWT | Добавя bookmark |
| DELETE | `/api/bookmark` | ✅ JWT | Премахва bookmark |

### Muscle Routes ([muscles.js](file:///d:/project/muscle-map-main/muscle-map-main/server/routes/muscles.js))
| Method | Endpoint | Auth? | Описание |
|--------|----------|-------|----------|
| GET | `/api/muscles` | ❌ | Всички мускулни групи |
| GET | `/api/muscles/:key` | ❌ | Детайли за конкретен мускул |

### AI Chat ([chat.js](file:///d:/project/muscle-map-main/muscle-map-main/server/routes/chat.js))
| Method | Endpoint | Auth? | Описание |
|--------|----------|-------|----------|
| POST | `/api/chat` | ✅ JWT | AI chatbot съобщение → Groq API |

### Workout ([workout.js](file:///d:/project/muscle-map-main/muscle-map-main/server/routes/workout.js))
| Method | Endpoint | Auth? | Описание |
|--------|----------|-------|----------|
| POST | `/api/workout/generate` | ✅ JWT | Генерира AI тренировъчен план |
| GET | `/api/workout/plans` | ✅ JWT | Взема запазени планове |
| DELETE | `/api/workout/plans/:id` | ✅ JWT | Изтрива план |

### Diet ([diets.js](file:///d:/project/muscle-map-main/muscle-map-main/server/routes/diets.js))
| Method | Endpoint | Auth? | Описание |
|--------|----------|-------|----------|
| GET | `/api/diets` | ❌ | Всички хранителни планове |

### Contact ([contact.js](file:///d:/project/muscle-map-main/muscle-map-main/server/routes/contact.js))
| Method | Endpoint | Auth? | Описание |
|--------|----------|-------|----------|
| POST | `/api/contact` | ❌ | Контактна форма → email до musclemap@yahoo.com |

### Stripe ([stripe.js](file:///d:/project/muscle-map-main/muscle-map-main/server/routes/stripe.js))
| Method | Endpoint | Auth? | Описание |
|--------|----------|-------|----------|
| POST | `/api/stripe/create-checkout-session` | ✅ JWT | Създава Stripe checkout |
| POST | `/api/stripe/webhook` | ❌ (Stripe) | Webhook за payment events |

---

## 🛡️ Сигурност & Rate Limiting

| Endpoint | Лимит | Описание |
|----------|-------|----------|
| `/api/*` (general) | 100 req / 15 min | Общ лимит |
| `/api/register`, `/api/login` | 10 req / 15 min | Brute-force защита |
| `/api/chat`, `/api/workout` | 5 req / 1 min | AI rate limiting |
| `/api/contact` | 3 req / 15 min | Anti-spam |

### Допълнителни мерки:
- **bcrypt (cost 10)** — парола хеширане
- **JWT (7 дни)** — сесия с expiration
- **CORS whitelist** — само localhost:8080 и muscle-map-main.vercel.app
- **Helmet/express.json** — стандартни Express security headers
- **Stripe webhook signature** — верификация на payment events

---

## 🎮 Gamification система

[GamificationEngine.tsx](file:///d:/project/muscle-map-main/muscle-map-main/client/src/components/features/GamificationEngine.tsx) следи действията на потребителя и отключва значки:

| Значка | Условие |
|--------|---------|
| 🏋️ First Exercise | Преглед на първо упражнение |
| 📚 Knowledge Seeker | Преглед на 5 упражнения |
| ⭐ Bookworm | 3 bookmark-а |
| 🧮 Health Aware | Използване на BMI калкулатора |
| 🥗 Nutrition Pro | Преглед на хранителен план |
| 🤖 AI Explorer | Използване на AI chatbot |

---

## 📧 Email система

[sendEmail.js](file:///d:/project/muscle-map-main/muscle-map-main/server/utils/sendEmail.js) — един utility, ползва се навсякъде:

```
Gmail SMTP (christian133769@gmail.com)
  ├── Verify Email       → до новорегистрирания потребител
  ├── Password Reset     → до потребителя който е забравил паролата
  ├── Contact (admin)    → до musclemap@yahoo.com (с Reply-To)
  └── Contact (confirm)  → потвърждение обратно до потребителя
```

---

## 🌍 Двуезичност (i18n)

- `i18next` + `react-i18next`
- Файлове: `locales/en/translation.json` и `locales/bg/translation.json`
- Превключвател: [LanguageToggle.tsx](file:///d:/project/muscle-map-main/muscle-map-main/client/src/components/ui/LanguageToggle.tsx)
- Записва се в `localStorage` + се синхронизира с профила на потребителя

---

## 💳 Stripe Premium модел

```
Free Plan:
  - 10 bookmark-а максимум
  - 5 AI съобщения на ден
  - Основни функции

Premium Plan:
  - Неограничени bookmark-и
  - Неограничени AI съобщения
  - AI Workout Planner
  - Premium значка
```

### Поток на плащане:
```
1. Потребител кликва "Get Premium" → /premium
2. Frontend: POST /api/stripe/create-checkout-session
3. Backend: stripe.checkout.sessions.create() → redirect URL
4. Потребител попълва карта в Stripe Checkout
5. Stripe: webhook → POST /api/stripe/webhook
6. Backend: user.isPremium = true → save
7. Frontend: рефреш на профила → Premium активиран
```

---

## 🎨 Визуален дизайн & Анимации

### ReactBits компоненти:
| Компонент | Ефект | Къде се ползва |
|-----------|-------|---------------|
| [SoftAurora](file:///d:/project/muscle-map-main/muscle-map-main/client/src/components/reactbits/SoftAurora.tsx) | WebGL aurora фон | Глобално (App.tsx) |
| [AnimatedContent](file:///d:/project/muscle-map-main/muscle-map-main/client/src/components/reactbits/AnimatedContent.tsx) | Fade-in при scroll | Landing page секции |
| [TiltedCard](file:///d:/project/muscle-map-main/muscle-map-main/client/src/components/reactbits/TiltedCard.tsx) | 3D tilt при hover | Muscle cards |
| [SpotlightCard](file:///d:/project/muscle-map-main/muscle-map-main/client/src/components/reactbits/SpotlightCard.tsx) | Mouse spotlight | Feature cards |
| [ScrollFloat](file:///d:/project/muscle-map-main/muscle-map-main/client/src/components/reactbits/ScrollFloat.tsx) | Float text при scroll | Заглавия |
| [CountUp](file:///d:/project/muscle-map-main/muscle-map-main/client/src/components/reactbits/CountUp.tsx) | Animated number | Статистики |

### Цветова схема:
- Primary: `#274690` (тъмно синьо)
- Background: `#E5ECEF` (light) / `slate-950` (dark)
- Accent: `#2563eb` (blue-600)
- Glassmorphism: `backdrop-blur + bg-opacity`

---

## 🚀 Deployment

| Компонент | Платформа | URL |
|-----------|----------|-----|
| Frontend | Vercel | https://muscle-map-main.vercel.app |
| Backend | Koyeb | https://electronic-nadiya-musclemap-a30e9055.koyeb.app |
| Database | MongoDB Atlas | Cloud cluster |

### Environment Variables (.env — Server):
```
MONGO_URI=             # MongoDB Atlas connection string
JWT_SECRET=            # JWT signing secret
GROQ_API_KEY=          # Groq AI API key
EMAIL_USER=            # Gmail за SMTP (christian133769@gmail.com)
EMAIL_PASS=            # Gmail App Password
EMAIL_SERVICE=Gmail    # Email service
STRIPE_SECRET_KEY=     # Stripe secret key
STRIPE_WEBHOOK_SECRET= # Stripe webhook signing secret
CLIENT_URL=            # Frontend URL (за email линкове)
```

---

## 📊 Обобщение за дипломната работа

### Ключови функционалности:
1. ✅ Интерактивна SVG анатомична карта
2. ✅ AI фитнес чатбот (Groq LLaMA 3)
3. ✅ AI тренировъчен план генератор
4. ✅ BMI/TDEE калкулатор
5. ✅ Персонализирани хранителни планове
6. ✅ Bookmark система (с Premium limit)
7. ✅ Gamification (значки/постижения)
8. ✅ Google OAuth + Email/Password auth
9. ✅ Email верификация + Password Reset
10. ✅ Stripe Premium subscriptions
11. ✅ Двуезичност (EN/BG)
12. ✅ Dark/Light mode
13. ✅ GDPR compliance (Terms, Privacy, Cookies, Refund)
14. ✅ Contact форма (с real email delivery)
15. ✅ Rate limiting & Security
16. ✅ Responsive design (mobile + desktop)
17. ✅ WebGL анимации (Aurora, Tilt, Spotlight)
18. ✅ Vercel Analytics + Speed Insights

### Брой файлове:
- **9** App страници
- **5** Auth страници
- **8** Static/Legal страници
- **6** Feature компоненти
- **6** ReactBits анимационни компоненти
- **4** UI компоненти
- **3** Layout компоненти
- **5** Backend контролери
- **7** API route файла
- **4** MongoDB модели
- **2** Utils (email + auth middleware)
- **1** Централизиран API service

**Общо: ~50+ файла, fullstack SaaS платформа.**
