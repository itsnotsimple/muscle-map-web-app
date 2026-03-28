const aiService = require('../services/aiService');
const User = require('../models/User');

exports.handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const user = await User.findById(req.user.id);

        // 24-hour rolling window limit logic for free users
        if (!user.isPremium) {
            const ONE_DAY_MS = 24 * 60 * 60 * 1000;
            const now = new Date();

            if (!user.aiMessageDate || (now - new Date(user.aiMessageDate)) > ONE_DAY_MS) {
                user.aiMessageCount = 0;
                user.aiMessageDate = now;
            }

            if (user.aiMessageCount >= 5) {
                return res.status(403).json({ error: "LIMIT_REACHED" });
            }

            user.aiMessageCount += 1;
            await user.save();
        }

        // Context injection for premium users
        let userProfileContext = "";
        if (user.isPremium && user.physicalProfile && user.physicalProfile.age) {
            const p = user.physicalProfile;
            userProfileContext = `The user is ${p.gender}, ${p.age} years old, weighs ${p.weight}kg, is ${p.height}cm tall. Activity: ${p.activityLevel}. Tailor your advice perfectly to this profile naturally!`;
        }

        const response = await aiService.generateChatResponse(message, history || [], userProfileContext);
        
        res.json({ 
            reply: response,
            remainingMessages: !user.isPremium ? Math.max(0, 5 - user.aiMessageCount) : null 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong parsing the AI chat request." });
    }
};

exports.getChatStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.isPremium) {
            return res.json({ remainingMessages: null, isPremium: true });
        }

        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const now = new Date();
        let currentCount = user.aiMessageCount || 0;

        if (!user.aiMessageDate || (now - new Date(user.aiMessageDate)) > ONE_DAY_MS) {
            currentCount = 0;
        }

        res.json({ 
            remainingMessages: Math.max(0, 5 - currentCount),
            isPremium: false
        });
    } catch (error) {
        console.error("Error fetching chat status:", error);
        res.status(500).json({ error: "Could not fetch chat status" });
    }
};
