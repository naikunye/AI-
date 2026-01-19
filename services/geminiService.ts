
import { GoogleGenAI, Type } from "@google/genai";
import { Platform, Tone, GenerationResult, ReviewContext, Resolution, ReviewClassification, ReplyType } from '../types';
import { PLATFORM_CONFIG, RESOLUTION_CONFIG } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    classification: {
      type: Type.STRING,
      enum: Object.values(ReviewClassification),
      description: "Classify the review."
    },
    reviewSummary: {
      type: Type.STRING,
      description: "A brief summary of what the customer said (In Chinese)."
    },
    complianceNotes: {
      type: Type.STRING,
      description: "Notes on safety and compliance (In Chinese)."
    },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: Object.values(ReplyType) },
          headline: { type: Type.STRING, description: "Short label in Chinese (e.g. '全额退款提议')" },
          bodyEnglish: { type: Type.STRING, description: "The actual reply text in ENGLISH to send to the US customer." },
          bodyChinese: { type: Type.STRING, description: "The exact translation of the English reply into Chinese, so the user understands what they are sending." },
          toneAnalysis: { type: Type.STRING, description: "Why this works (In Chinese)." }
        },
        required: ["type", "headline", "bodyEnglish", "bodyChinese", "toneAnalysis"]
      }
    }
  },
  required: ["classification", "reviewSummary", "complianceNotes", "options"]
};

export const generateReviewReply = async (
  reviewText: string,
  platform: Platform,
  tone: Tone,
  resolution: Resolution,
  context: ReviewContext
): Promise<GenerationResult> => {
  
  const platformRules = PLATFORM_CONFIG[platform].rules;
  const resolutionContext = resolution !== Resolution.NONE ? `Proposed Resolution: ${RESOLUTION_CONFIG[resolution].label}` : "Resolution: Standard customer service response.";
  
  let prompt = `
    You are an expert E-commerce Customer Experience Manager assisting a Chinese seller who sells to the US market.
    
    **Task:** Analyze the customer review and generate 3 distinct reply options.
    
    **CRITICAL REQUIREMENT:**
    The seller does NOT speak good English. You must provide the reply in **English** (for the customer) AND a **Chinese translation** (for the seller to understand).

    **Input Data:**
    - Customer Review: "${reviewText}"
    - Platform: ${platform} (Rules: ${platformRules})
    - Desired Tone: ${tone}
    - Resolution Strategy: ${resolutionContext}
    - Context: Customer Name: ${context.customerName || "N/A"}, Product: ${context.productName || "N/A"}, Notes: ${context.keyPointsToAddress || "N/A"}

    **Classification Logic:**
    - Detect "High Risk" (fake, scam, legal threats). 
    - Otherwise classify as Positive, Neutral, or Negative.

    **Content Rules:**
    - **Amazon:** No external links. No asking for personal contact info.
    - **TikTok:** Casual, emojis allowed.
    - **Language:** 'bodyEnglish' must be perfect, native US English. 'bodyChinese' must be a clear translation of that English text.

    **Output Structure:**
    Provide 3 options:
    1. A standard/safe response.
    2. A response focused on the specific resolution (if any).
    3. A slightly different tone variation (e.g., shorter or more detailed).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GenerationResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
