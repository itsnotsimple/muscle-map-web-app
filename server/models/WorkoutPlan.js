const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sets: { type: String, required: true },       // "4 x 8-10"
    rest: { type: String },                        // "90s"
    tip: { type: String }
}, { _id: false });

const DaySchema = new mongoose.Schema({
    dayNumber: { type: Number, required: true },   // 1, 2, 3...
    focus: { type: String, required: true },        // "Push (Chest, Shoulders, Triceps)"
    exercises: [ExerciseSchema]
}, { _id: false });

const WorkoutPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: String, required: true },         // "Muscle Gain" / "Weight Loss" / "Maintenance"
    days: { type: Number, required: true },         // 3, 4, 5, 6
    level: { type: String, required: true },        // "Beginner" / "Intermediate" / "Advanced"
    plan: [DaySchema],                              // Структуриран масив от дни
    recoveryTips: [{ type: String }],               // Съвети за възстановяване
    title: { type: String },                        // Auto-generated: "4-Day Muscle Gain (Intermediate)"
}, { timestamps: true });

// Потребител може да има максимум 5 запазени плана
WorkoutPlanSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema);
