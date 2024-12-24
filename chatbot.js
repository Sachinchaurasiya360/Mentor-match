/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 * $ npm install dotenv
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

require('dotenv').config();

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

// Correctly reference the environment variable
const apiKey = process.env.AI_API_KEY; 

if (!apiKey) {
    throw new Error("API key not found. Please set the gemini _API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function run() {
    const chatSession = model.startChat({
        generationConfig,
        // safetySettings: Adjust safety settings
        // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [],
    });

    const result = await chatSession.sendMessage("Hello, how are you?");
    console.log(result.response.text());
}

run();
