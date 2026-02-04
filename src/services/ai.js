import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const sendMessageToAI = async (message, image, history) => {
    if (!API_KEY || API_KEY.includes('PASTE_YOUR_API_KEY_HERE')) {
        return {
            role: 'assistant',
            content: "Configuration Error: Please set your valid VITE_GEMINI_API_KEY in the .env file."
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
        return {
            role: 'assistant',
            content: "I'm unable to process that request right now. Please check your network connection or API key."
        };
    }
};
