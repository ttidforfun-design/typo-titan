
import { GoogleGenAI } from '@google/genai';
import { GameMode } from '../types';

export const generateTypingText = async (
    ai: GoogleGenAI,
    mode: GameMode,
    duration: number
): Promise<string> => {
    
    // Estimate words needed: average typing speed is 50 WPM.
    // So for a 60s test, we'd need about 50 words. Add a buffer.
    const wordsNeeded = Math.ceil((duration / 60) * 50 * 1.5);

    let prompt: string;
    switch (mode) {
        case GameMode.BEGINNER:
            prompt = `Generate a list of ${wordsNeeded} common, simple, lowercase English words separated by a single space. No punctuation.`;
            break;
        case GameMode.ADVANCED:
        default:
            prompt = `Generate a paragraph of exactly ${wordsNeeded} words for a typing test. Use proper punctuation, capitalization, and varied sentence structure. The paragraph should be interesting and coherent. Do not use any markdown or special formatting.`;
            break;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text.trim().replace(/\s+/g, ' '); // Normalize whitespace
        return text;
    } catch (error) {
        console.error("Gemini API error:", error);
        throw new Error("Failed to generate text from Gemini API.");
    }
};
