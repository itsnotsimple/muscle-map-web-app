const express = require('express');
const router = express.Router();
const Muscle = require('../models/Muscle'); // <--- Тук викаме модела от стъпка 1
const seedData = require('../seedData'); // Ако ползваш seed, иначе го махни

// 1. Взимане на упражнение по ключ
router.get('/muscles/:key', async (req, res) => {
  try {
    const muscle = await Muscle.findOne({ key: req.params.key });
    res.json(muscle || { message: "Not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Seed (Зареждане на базата) - преместваме го тук
router.get('/seed', async (req, res) => {
  try {
    await Muscle.deleteMany({});
    await Muscle.insertMany(seedData);
    res.send("✅ Database seeded!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;