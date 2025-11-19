
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, LessonType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeHandwriting = async (
  imageBase64: string,
  targetChar: string,
  type: LessonType
): Promise<AIResponse> => {
  if (!apiKey) {
    return {
      success: false,
      message: "API Key missing. Please configure the environment.",
      stars: 0
    };
  }

  try {
    // Remove data:image/png;base64, prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    let contextDescription = "";
    if (type === LessonType.NUMBERS) {
      contextDescription = `the number "${targetChar}"`;
    } else if (type === LessonType.LOWERCASE) {
      contextDescription = `the lowercase letter "${targetChar}"`;
    } else {
      contextDescription = `the uppercase letter "${targetChar}"`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64,
            },
          },
          {
            text: `I am a child learning to write. I just tried to write ${contextDescription}. 
            Please grade my work kindly but be honest if it doesn't look like the target.
            Output strictly valid JSON.
            schema:
            {
              "success": boolean (true if it looks reasonably like the target, false if unrecognizable),
              "message": string (a short, encouraging sentence suitable for a 5 year old),
              "funFact": string (a very short simple fact related to the number or a word starting with the letter, only if success is true),
              "stars": number (1, 2, or 3 based on quality)
            }`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
            funFact: { type: Type.STRING },
            stars: { type: Type.INTEGER },
          },
        }
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIResponse;
    }
    
    throw new Error("No response text");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      message: "Oops! I couldn't see that properly. Can you try again?",
      stars: 0
    };
  }
};
