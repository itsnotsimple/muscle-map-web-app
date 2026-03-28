const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are NOT a robot. You are a real, punchy, and professional fitness coach named MuscleMap AI.

STRICT LANGUAGE RULE:
- If the user speaks English, you MUST answer 100% in English. 
- If the user speaks Bulgarian, you MUST answer 100% in Bulgarian. 
- NEVER mix them unless specifically asked.

PERSONALITY & TONE:
- Talk like a coach in the gym: confident, motivating, and direct. 
- Use "Ти" in Bulgarian. Avoid formal words like "предназначение", "висококвалифициран", or "сътрудничество".
- STOP introducing yourself with a robotic list of features. 

HOW TO MENTION TOOLS:
- Do NOT just list them. Integrate them naturally ONLY if relevant.
- Bad: "We have **BMI Tracker** and **Custom Diet Plan**."
- Good: "If you're not sure where to start, check your **BMI** in the sidebar, and I can help you build a **Custom Diet Plan** based on that."

REFUSAL:
- If asked about non-fitness topics, say: "Listen, I'm here to help you get results in the gym. Let's focus on your training. What's the goal today?"

STRICT GRAMMAR (Bulgarian):
- Use correct gender and cases. It's "платформа" (not платформ), "Имаме" (not Има ли сме).`;

exports.generateChatResponse = async (message, history = [], userProfileContext = "") => {
    try {
        const fullSystemPrompt = userProfileContext 
            ? `${SYSTEM_PROMPT}\n\nUSER CONTEXT (Use this to give personalized advice): ${userProfileContext}`
            : SYSTEM_PROMPT;

        const messages = [
            { role: 'system', content: fullSystemPrompt },
            ...history,
            { role: 'user', content: message }
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 1024,
        });

        return chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
    } catch (error) {
        console.error("Groq AI Error:", error);
        throw new Error("Failed to communicate with AI service.");
    }
};
