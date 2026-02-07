import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const sendMessageToAI = async (message, image, history) => {
    // 1. Mock Mode Check
    if (!API_KEY || API_KEY.includes('PASTE_YOUR_API_KEY_HERE')) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            role: 'assistant',
            content: "🤖 **Guest Mode:** I am running in simulation mode because no valid API key was found.\n\nI can't truly " +
                "understand your text, but I can tell you that you said: \"" + message + "\""
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let prompt = message;
        let imagePart = null;

        if (image) {
            // Convert data_url to base64
            const base64Data = image.split(',')[1];
            imagePart = {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            };
        }

        let result;
        if (imagePart) {
            // For image, we currently do single-turn (ignoring deep history for stability)
            result = await model.generateContent([prompt, imagePart]);
        } else {
            // Prepare history: Map 'assistant' -> 'model', filter system messages logic if any
            let chatHistory = history.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            }));

            // Gemini requirement: History must not start with a model message
            if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
                chatHistory.shift();
            }

            const chat = model.startChat({
                history: chatHistory
            });
            result = await chat.sendMessage(prompt);
        }

        const response = await result.response;
        const text = response.text();

        return {
            content: text,
            role: 'assistant'
        };

    } catch (error) {
        console.error("Gemini API Error:", error);

        // Fallback to mock if API fails
        return {
            role: 'assistant',
            content: "🤖 **Guest Mode Fallback:** The AI service is unavailable (likely due to an invalid API key). \n\n" +
                "Using simulation mode. You said: \"" + message + "\""
        };
    }
};
