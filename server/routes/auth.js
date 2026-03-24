const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn("⚠️  WARNING: JWT_SECRET is not defined in the environment variables!");
}

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

// --- ROUTES ---

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// 1. РЕГИСТРАЦИЯ
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({ 
        email, 
        password: hashedPassword,
        verificationToken,
        isVerified: false,
        authProvider: 'local'
    });
    await newUser.save();

    // Send Welcome & Verification Email
    const verificationUrl = `https://muscle-map-main.vercel.app/verify/${verificationToken}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #1e293b; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; tracking: tight;">MUSCLE MAP</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">Welcome to Muscle Map!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">Thank you for creating an account with us. We're thrilled to have you join our community!</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">To get started and unlock all features, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #475569; font-size: 14px; margin-bottom: 0;">If you didn't create this account, you can safely ignore this email.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; 2026 Muscle Map. All rights reserved.</p>
        </div>
      </div>
    `;

    // Fire-and-forget: Пращаме имейла във фонов режим, за да не бавим сървъра!
    sendEmail({
        to: email,
        subject: 'Welcome to Muscle Map - Verify Your Email',
        html: emailHtml
    }).then(() => console.log(`Verification email sent to ${email}`))
      .catch(emailError => console.error('Email sending failed in background:', emailError));

    res.status(201).json({ message: "User created successfully. Please check your email to verify." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 1.5. ВЕРИФИКАЦИЯ НА ИМЕЙЛ
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined; // Премахваме токена
        await user.save();

        res.json({ message: "Email successfully verified!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. ЛОГИН
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
        token, 
        user: { 
            email: user.email, 
            savedExercises: user.savedExercises,
            theme: user.theme || 'system',
            language: user.language || 'en',
            physicalProfile: user.physicalProfile,
            isVerified: user.isVerified,
            authProvider: user.authProvider,
            createdAt: user.createdAt
        } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2.5 GOOGLE LOGIN (OAuth)
router.post('/google', async (req, res) => {
    try {
        const { access_token } = req.body;
        if (!access_token) return res.status(400).json({ message: "No access token provided" });

        // Извличаме данните на потребителя от Google сигурно
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        
        if (!googleResponse.ok) {
            throw new Error("Failed to verify Google Token");
        }

        const payload = await googleResponse.json();
        const email = payload.email;

        if (!email) {
            return res.status(400).json({ message: "No email associated with this Google account" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            // Ако потребителят не съществува, създаваме го
            const salt = await bcrypt.genSalt(10);
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({
                email,
                password: hashedPassword,
                isVerified: true, // Имейлите от Google са автоматично потвърдени
                authProvider: 'google'
            });
            await user.save();
        }

        // Създаваме JWT токен за нашата система
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ 
            token, 
            user: { 
                email: user.email, 
                savedExercises: user.savedExercises,
                theme: user.theme || 'system',
                language: user.language || 'en',
                physicalProfile: user.physicalProfile,
                isVerified: user.isVerified,
                authProvider: user.authProvider,
                createdAt: user.createdAt
            } 
        });

    } catch (err) {
        console.error("Google Auth Error:", err);
        res.status(500).json({ message: "Google Authentication Failed" });
    }
});

// 3. ОБНОВЯВАНЕ НА ПРЕДПОЧИТАНИЯ (PUT)
router.put('/user/preferences', authenticateToken, async (req, res) => {
  try {
    const { theme, language } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (theme) user.theme = theme;
    if (language) user.language = language;

    await user.save();
    res.json({ message: "Preferences updated", theme: user.theme, language: user.language });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3.5 ОБНОВЯВАНЕ НА ФИЗИЧЕСКИ ПРОФИЛ (PUT)
router.put('/user/profile', authenticateToken, async (req, res) => {
  try {
    const { age, gender, height, weight, activityLevel } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Гарантираме, че обектът съществува, преди да му присвояваме свойства
    if (!user.physicalProfile) {
        user.physicalProfile = {};
    }

    if (age !== undefined) user.physicalProfile.age = age;
    if (gender !== undefined) user.physicalProfile.gender = gender;
    if (height !== undefined) user.physicalProfile.height = height;
    if (weight !== undefined) user.physicalProfile.weight = weight;
    if (activityLevel !== undefined) user.physicalProfile.activityLevel = activityLevel;

    await user.save();
    res.json({ message: "Profile updated successfully", physicalProfile: user.physicalProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. ДОБАВЯНЕ НА BOOKMARK (POST) - ПОПРАВЕНО
router.post('/user/bookmark', authenticateToken, async (req, res) => {
  try {
    const { exercise } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    // Проверка: Има ли го вече по име?
    const exists = user.savedExercises.find(ex => ex.name === exercise.name);
    
    if (exists) {
      // Ако вече го има, връщаме съобщение (или може да го махнем, ако искаш toggle)
      return res.status(400).json({ message: "Already saved" });
    }

    // ВАЖНО: Създаваме нов обект, за да НЕ взимаме старото _id от exercise
    // Това предотвратява грешки с дублиращи се ID-та в Mongo
    const newBookmark = {
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        gif: exercise.gif || "", // Ако няма картинка, слагаме празен стринг
        difficulty: exercise.difficulty || "Beginner"
    };

    user.savedExercises.push(newBookmark);
    await user.save();
    
    // Връщаме целия нов списък
    res.json(user.savedExercises);
  } catch (err) {
    console.error("Error adding bookmark:", err);
    res.status(500).json({ message: err.message });
  }
});

// 5. GET BOOKMARKS
router.get('/user/bookmarks', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.savedExercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. ИЗТРИВАНЕ НА BOOKMARK (DELETE)
router.delete('/user/bookmarks/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Махаме елемента
    user.savedExercises.pull({ _id: req.params.id });
    await user.save();

    // ВРЪЩАМЕ ДИРЕКТНО МАСИВА
    res.json(user.savedExercises); 
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// 7. ИЗТРИВАНЕ НА АКАУНТ (DELETE)
router.delete('/user/profile', authenticateToken, async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.authProvider === 'local') {
            if (!password) {
                return res.status(400).json({ message: "Password is required to delete account" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect password" });
            }
        }

        await User.findByIdAndDelete(userId);
        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;