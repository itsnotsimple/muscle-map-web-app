const aiService = require('../services/aiService');
const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');

// Генерира нов план (без да го запазва автоматично)
exports.generatePlan = async (req, res) => {
    try {
        const { goal, days, level, language } = req.body;

        if (!goal || !days || !level) {
            return res.status(400).json({ error: "Goal, days, and level are required." });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found." });
        if (!user.isPremium) {
            return res.status(403).json({ error: "PREMIUM_REQUIRED" });
        }

        const result = await aiService.generateWorkoutPlan({ 
            goal, 
            days: parseInt(days), 
            level,
            language: language || 'en'
        });

        // Изпращаме парснатия JSON (plan + recoveryTips) без да записваме
        res.json(result);
    } catch (error) {
        console.error("Workout generation error:", error);
        res.status(500).json({ error: "Failed to generate workout plan. Please try again." });
    }
};

// Запазва генериран план в базата
exports.savePlan = async (req, res) => {
    try {
        const { goal, days, level, plan, recoveryTips } = req.body;

        if (!plan || !Array.isArray(plan) || plan.length === 0) {
            return res.status(400).json({ error: "Invalid plan data." });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found." });
        if (!user.isPremium) {
            return res.status(403).json({ error: "PREMIUM_REQUIRED" });
        }

        // Проверяваме лимит — максимум 5 плана
        const existingCount = await WorkoutPlan.countDocuments({ userId: req.user.id });
        if (existingCount >= 5) {
            return res.status(400).json({ error: "PLAN_LIMIT", message: "Maximum 5 saved plans. Delete one to save a new one." });
        }

        const title = `${days}-Day ${goal} (${level})`;

        const newPlan = new WorkoutPlan({
            userId: req.user.id,
            goal,
            days: parseInt(days),
            level,
            plan,
            recoveryTips: recoveryTips || [],
            title
        });

        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (error) {
        console.error("Save plan error:", error);
        res.status(500).json({ error: "Failed to save workout plan." });
    }
};

// Взима всички планове на потребителя
exports.getPlans = async (req, res) => {
    try {
        const plans = await WorkoutPlan.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5);
        res.json(plans);
    } catch (error) {
        console.error("Get plans error:", error);
        res.status(500).json({ error: "Failed to fetch plans." });
    }
};

// Изтрива конкретен план
exports.deletePlan = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.id 
        });
        if (!plan) return res.status(404).json({ error: "Plan not found." });
        res.json({ message: "Plan deleted." });
    } catch (error) {
        console.error("Delete plan error:", error);
        res.status(500).json({ error: "Failed to delete plan." });
    }
};
