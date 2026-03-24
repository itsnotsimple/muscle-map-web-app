const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const Muscle = require('./models/Muscle');
const seedData = require('./seedData');

// Форсираме Node.js да използва Google DNS (8.8.8.8) локално
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.log("DNS Override warning:", e);
}

dotenv.config();

const seedMuscles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/musclewiki', {
            family: 4
        });
        console.log("✅ MongoDB Connected for Seeding Muscles...");

        // Изтриване на стари мускули
        await Muscle.deleteMany();
        console.log("🗑️ Cleared existing muscles");

        // Вмъкване на нови
        await Muscle.insertMany(seedData);
        console.log("✨ Inserted Muscles and Exercises successfully!");

        process.exit();
    } catch (err) {
        console.error("❌ Error seeding muscles:", err);
        process.exit(1);
    }
};

seedMuscles();
