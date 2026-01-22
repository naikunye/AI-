
import { GoogleGenAI, Type } from "@google/genai";
import { Platform, Tone, GenerationResult, ReviewContext, Resolution, ReviewClassification, ReplyType, ReplyLength, EmojiLevel, LanguageStyle, ProductCategory } from '../types';
import { PLATFORM_CONFIG, RESOLUTION_CONFIG, CATEGORY_CONFIG } from '../constants';

// Define the response schema
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    classification: {
      type: Type.STRING,
      enum: Object.values(ReviewClassification),
      description: "Classify the review."
    },
    riskScore: {
        type: Type.INTEGER,
        description: "A score from 0 (Safe) to 100 (Extremely High Risk/Scam/Legal Threat)."
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
  required: ["classification", "riskScore", "reviewSummary", "complianceNotes", "options"]
};

export const generateReviewReply = async (
  reviewText: string,
  platform: Platform,
  tone: Tone,
  resolution: Resolution,
  context: ReviewContext,
  // New Parameters with Defaults
  length: ReplyLength = ReplyLength.MEDIUM,
  emoji: EmojiLevel = EmojiLevel.MINIMAL,
  style: LanguageStyle = LanguageStyle.NATIVE_US
): Promise<GenerationResult> => {
  
  // CRITICAL: Check for API Key explicitly before attempting to create client or call API.
  if (!process.env.API_KEY || process.env.API_KEY === '') {
    throw new Error("API_KEY_MISSING");
  }

  // Always instantiate the client inside the function call.
  // This ensures that if the environment variable changes (unlikely in client-side but good practice) it is picked up.
  const client = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const platformRules = PLATFORM_CONFIG[platform].rules;
  const resolutionContext = resolution !== Resolution.NONE ? `Proposed Resolution: ${RESOLUTION_CONFIG[resolution].label}` : "Resolution: Standard customer service response.";
  const categoryLabel = context.category ? CATEGORY_CONFIG[context.category].label : "General Product";

  // Logic for Emojis
  let emojiInstruction = "Use minimal emojis (1-2) to be friendly.";
  if (emoji === EmojiLevel.NONE) emojiInstruction = "DO NOT use any emojis. Keep it strictly text.";
  if (emoji === EmojiLevel.HEAVY) emojiInstruction = "Use emojis frequently (3-5) to show high energy and friendliness.";

  // Logic for Length
  let lengthInstruction = "Keep the response length moderate (3-5 sentences).";
  if (length === ReplyLength.SHORT) lengthInstruction = "Keep it very short and concise (1-2 sentences max). Direct to the point.";
  if (length === ReplyLength.LONG) lengthInstruction = "Write a detailed, comprehensive response (5+ sentences) ensuring all concerns are fully addressed.";

  let prompt = `
    You are an expert E-commerce Customer Experience Manager assisting a Chinese seller who sells to the US market.
    
    **Task:** Analyze the customer review and generate 3 distinct reply options.
    
    **Seller Settings:**
    - **Platform:** ${platform} (Rules: ${platformRules})
    - **Tone:** ${tone}
    - **Resolution Strategy:** ${resolutionContext}
    - **Product Category:** ${categoryLabel}
    
    **Style Preferences (CRITICAL):**
    - **Length:** ${length} - ${lengthInstruction}
    - **Emoji Usage:** ${emoji} - ${emojiInstruction}
    - **Language Style:** ${style}
    
    **Context Data:**
    - Customer Name: ${context.customerName || "N/A"}
    - Product Name: ${context.productName || "N/A"}
    - Key Points to Address: ${context.keyPointsToAddress || "N/A"}

    **Input Review:**
    "${reviewText}"

    **Classification Logic:**
    - Detect "High Risk" (fake, scam, legal threats, policy violations). Assign a Risk Score (0-100).
    - Otherwise classify as Positive, Neutral, or Negative.

    **Content Guidelines:**
    - **Amazon:** No external links. No asking for personal contact info.
    - **TikTok:** Casual, high energy allowed.
    - **General:** Always follow the "Empathy -> Apology -> Action -> Closing" framework for negative reviews.
    - **Language:** 'bodyEnglish' must be perfect, natural English matching the '${style}' preference. 'bodyChinese' must be a clear translation.

    **Output Structure:**
    Provide 3 options:
    1. A standard/safe response matching the settings.
    2. A response focused heavily on the specific resolution or action.
    3. A variation (e.g., if Short, make this one slightly more detailed; if Professional, make this one slightly warmer).
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    // Robust cleaning: remove Markdown code fences if present (```json or ```)
    const cleanText = text.replace(/```json\n?|```/g, '').trim();

    return JSON.parse(cleanText) as GenerationResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
