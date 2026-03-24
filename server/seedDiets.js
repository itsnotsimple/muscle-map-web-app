const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const Diet = require('./models/Diet');

// Форсираме Node.js да използва Google DNS (8.8.8.8) локално
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.log("DNS Override warning:", e);
}

dotenv.config();

const dietsToSeed = [
    {
        identifier: "balanced",
        name: "Balanced Diet",
        description: "A well-rounded diet suitable for most people. Provides energy for workouts while maintaining steady blood sugar levels.",
        macroSplit: {
            protein: 30,
            carbs: 40,
            fats: 30
        },
        goodFoods: ["Chicken Breast", "Oats", "Sweet Potatoes", "Olive Oil", "Mixed Veggies", "Eggs"]
    },
    {
        identifier: "high_protein",
        name: "High Protein",
        description: "Optimal for muscle building and retention during fat loss. High thermic effect and keeps you full longer.",
        macroSplit: {
            protein: 40,
            carbs: 30,
            fats: 30
        },
        goodFoods: ["Lean Beef", "Greek Yogurt", "Whey Protein", "Fish", "Quinoa", "Almonds"]
    },
    {
        identifier: "keto",
        name: "Ketogenic Diet",
        description: "Very low carb diet designed to put the body into ketosis, burning fat for fuel instead of glucose.",
        macroSplit: {
            protein: 25,
            carbs: 5,
            fats: 70
        },
        goodFoods: ["Avocados", "Salmon", "Cheese", "Olive Oil", "Walnuts", "Spinach"]
    },
    {
        identifier: "low_fat",
        name: "Low Fat",
        description: "Traditional weight loss approach that restricts fat intake to create a caloric deficit easily.",
        macroSplit: {
            protein: 30,
            carbs: 50,
            fats: 20
        },
        goodFoods: ["White Fish", "Rice", "Beans", "Lentils", "Egg Whites", "Fruits"]
    }
];

const seedDiets = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/musclewiki', {
            family: 4
        });
        console.log("✅ MongoDB Connected for Seeding Diets...");

        // Изтриване на стари диети
        await Diet.deleteMany();
        console.log("🗑️ Cleared existing diets");

        // Вмъкване на нови
        await Diet.insertMany(dietsToSeed);
        console.log("✨ Inserted Diet Plans successfully!");

        process.exit();
    } catch (err) {
        console.error("❌ Error seeding diets:", err);
        process.exit(1);
    }
};

seedDiets();
