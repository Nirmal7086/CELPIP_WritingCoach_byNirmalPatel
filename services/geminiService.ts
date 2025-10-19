
import { GoogleGenAI, Content } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import type { ChatMessage } from '../types';

const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

export const getCoachResponse = async (history: ChatMessage[]): Promise<string> => {
    const contents: Content[] = history.map(message => ({
        role: message.sender === 'user' ? 'user' : 'model',
        parts: [{ text: message.text }],
    }));

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: contents,
            config: {
                systemInstruction: SYSTEM_PROMPT,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        throw new Error("Failed to get response from Gemini API. Please check your API key and network connection.");
    }
};
