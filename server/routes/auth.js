const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

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

// 1. РЕГИСТРАЦИЯ
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
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
            createdAt: user.createdAt
        } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. ДОБАВЯНЕ НА BOOKMARK (POST) - ПОПРАВЕНО
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

// 4. GET BOOKMARKS
router.get('/user/bookmarks', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.savedExercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. ИЗТРИВАНЕ НА BOOKMARK (DELETE)
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

module.exports = router;