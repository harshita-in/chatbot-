import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("Error: API_KEY is missing.");
    process.exit(1);
}

try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Using the model manager to list models
    // Note: SDK structure might differ slightly, but usually genAI.getGenerativeModel is the entry.
    // Actually, listModels is on the genAI instance or a distinct manager in newer SDKs?
    // Let's check docs or try the direct request if unsure. 
    // In v0.1.0+ it was separate. In 0.24.1:
    // There isn't a top-level listModels on GoogleGenerativeAI class in the standard docs easily visible,
    // but it's often available via a ModelService or similar.
    // Let's try to just fetch "gemini-pro" which is the most standard one.

    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Fallback to pro
    console.log("Trying gemini-pro...");
    const result = await model.generateContent("Hi");
    console.log("Success with gemini-pro: ", result.response.text());
} catch (error) {
    console.error("Error with gemini-pro:", error.message);
}
