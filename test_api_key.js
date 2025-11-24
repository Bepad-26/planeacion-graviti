import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyBfKz8JZfY1fNWwwivfyp5GEcB2xFzwzjA';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function test() {
    try {
        const prompt = 'Hello, are you working?';
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Success! Response:', text);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

test();
