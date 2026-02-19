
import { GoogleGenAI, Type } from "@google/genai";
import { SuggestedPrice, ChatMessage, VehicleClass } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Robust wrapper for Gemini API calls.
 * If a quota limit (429) or any error occurs, it returns a sensible fallback
 * to ensure the UI remains functional and responsive.
 */
const safeAiCall = async <T>(call: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await call();
  } catch (error: any) {
    console.warn("Gemini API Status - Using Mock Data:", error?.message || "Quota or Connectivity issue");
    return fallback;
  }
};

export const getSuggestedPrice = async (
  pickup: string,
  destination: string,
  vehicleClass: VehicleClass = 'standard',
  stopCount: number = 0
): Promise<SuggestedPrice | null> => {
  const prompt = `Act as a ride-sharing price analyst. 
  Analyze a trip from "${pickup}" to "${destination}".
  Trip Configuration:
  - Vehicle Class: ${vehicleClass}
  - Additional Stops: ${stopCount} stops.
  Pricing Rules:
  1. UK market rate.
  2. Multipliers: XL (+50%), Premium (+70%), Premium XL (+120%).
  Return JSON with: min, max, average, distance, duration.`;

  return safeAiCall(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            min: { type: Type.NUMBER },
            max: { type: Type.NUMBER },
            average: { type: Type.NUMBER },
            distance: { type: Type.STRING },
            duration: { type: Type.STRING }
          },
          required: ['min', 'max', 'average', 'distance', 'duration'],
        },
      },
    });

    return JSON.parse(response.text) as SuggestedPrice;
  }, { 
    min: 18.0, 
    max: 28.0, 
    average: 22.50, 
    distance: "4.8 miles", 
    duration: "14 mins" 
  });
};

export const getReverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const prompt = `Convert Lat ${lat}, Lng ${lng} to a street address. Return JSON with 'address'.`;
  
  return safeAiCall(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { address: { type: Type.STRING } },
          required: ['address'],
        },
      },
    });
    return JSON.parse(response.text).address;
  }, `Nearby: Street Area, Postcode-Region`);
};

export const getAddressSuggestions = async (input: string): Promise<string[]> => {
  if (!input || input.length < 3) return [];
  const prompt = `Return 5 UK address suggestions for "${input}". JSON with 'suggestions'.`;
  
  return safeAiCall(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['suggestions'],
        },
      },
    });
    return JSON.parse(response.text).suggestions;
  }, [
    `${input} High Street, London`,
    `${input} Station Approach, Manchester`,
    `${input} Park Lane, Birmingham`,
    `${input} Queen Street, Edinburgh`,
    `${input} Victoria Road, Leeds`
  ]);
};

export const getChatSuggestions = async (messages: ChatMessage[], role: 'customer' | 'driver'): Promise<string[]> => {
  const history = messages.slice(-3).map(m => m.text).join(' | ');
  const prompt = `Suggest 3 short chat replies for a ${role} based on context: ${history}. JSON with 'suggestions'.`;
  
  return safeAiCall(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['suggestions'],
        },
      },
    });
    return JSON.parse(response.text).suggestions;
  }, role === 'customer' ? ["I'm outside now.", "Which car are you in?", "Thanks for the heads up!"] : ["I've arrived.", "I'm 2 mins away.", "Where exactly are you?"]);
};
