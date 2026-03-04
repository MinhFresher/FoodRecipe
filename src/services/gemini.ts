import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Recipe, DietaryRestriction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeFridgeImage(base64Image: string): Promise<string[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Identify all visible food ingredients in this fridge. Return only a comma-separated list of ingredient names.",
          },
        ],
      },
    ],
  });

  const text = response.text || "";
  return text.split(",").map((s) => s.trim()).filter(Boolean);
}

export async function generateRecipes(ingredients: string[], restriction: DietaryRestriction): Promise<Recipe[]> {
  const prompt = `Based on these ingredients: ${ingredients.join(", ")}, suggest 3 recipes. 
  Dietary restriction: ${restriction}. 
  Include difficulty, prep time, calories, full ingredient list (mark which ones are likely missing from the provided list), and step-by-step instructions.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
            prepTime: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.STRING },
                  isMissing: { type: Type.BOOLEAN },
                },
                required: ["name", "isMissing"],
              },
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            imagePrompt: { type: Type.STRING },
          },
          required: ["id", "title", "description", "difficulty", "prepTime", "calories", "ingredients", "instructions"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse recipes", e);
    return [];
  }
}

export async function speakText(text: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this cooking instruction clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) {
    console.error("TTS failed", e);
    return null;
  }
}
