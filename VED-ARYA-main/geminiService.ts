
import { GoogleGenAI } from "@google/genai";
import { BodyParameter } from "./types";

// Always use named parameter for apiKey and assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWellnessInsight = async (stats: BodyParameter[]) => {
  if (stats.length === 0) return "No data available yet. Start your journey today!";

  const latest = stats[stats.length - 1];
  const previous = stats.length > 1 ? stats[stats.length - 2] : null;

  const prompt = `
    I am a Health and Wellness coach. Here are my client's current body parameters:
    Weight: ${latest.weight}kg, Body Fat: ${latest.bodyFat}%, BMI: ${latest.bmi}.
    ${previous ? `Last month: Weight: ${previous.weight}kg, Body Fat: ${previous.bodyFat}%` : ''}

    Please provide a short (2-3 sentences), encouraging, and professional insight about their progress and one specific actionable wellness tip. 
    Focus on positive reinforcement.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Keep up the great work! Your progress is inspiring.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Your progress is showing! Continue focusing on your goals.";
  }
};

export const generateWellnessTip = async () => {
  const prompt = "Give me one unique, short, and inspiring wellness tip for a social media post. Use emojis.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Listen to your body, it knows what it needs. 🌿";
  } catch (error) {
    return "Drink more water today! 💧";
  }
};
