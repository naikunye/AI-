
export enum Platform {
  AMAZON = 'Amazon',
  TIKTOK_SHOP = 'TikTok Shop',
  SHOPIFY = 'Shopify',
  ETSY = 'Etsy',
  GENERAL = 'General'
}

export enum Tone {
  PROFESSIONAL = 'Professional',
  EMPATHETIC = 'Empathetic',
  WITTY = 'Witty',
  FIRM = 'Firm',
  GRATEFUL = 'Grateful'
}

export enum ReviewClassification {
  POSITIVE = 'Positive',
  NEUTRAL = 'Neutral',
  NEGATIVE = 'Negative',
  HIGH_RISK = 'High Risk'
}

export enum Resolution {
  NONE = 'None',
  REFUND_ONLY = 'Refund Only',
  REFUND_KEEP = 'Refund & Keep',
  REPLACEMENT = 'Replacement',
  SUPPORT = 'Standard Support'
}

export enum ReplyType {
  PUBLIC = 'Public Comment',
  PRIVATE = 'Private Message'
}

export enum TemplateCategory {
  ALL = 'All',
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative',
  LOGISTICS = 'Logistics',
  INQUIRY = 'Inquiry',
  OTHER = 'Other'
}

// --- NEW FEATURES ---
export enum ReplyLength {
  SHORT = 'Short',
  MEDIUM = 'Medium',
  LONG = 'Long'
}

export enum EmojiLevel {
  NONE = 'None',
  MINIMAL = 'Minimal',
  HEAVY = 'Heavy'
}

export enum LanguageStyle {
  NATIVE_US = 'Native US',
  BRITISH_FORMAL = 'British Formal',
  GEN_Z = 'Gen Z / Slang',
  SIMPLE_ENGLISH = 'Simple English'
}

export enum ProductCategory {
  GENERAL = 'General',
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion/Apparel',
  BEAUTY = 'Beauty/Personal Care',
  HOME = 'Home & Kitchen',
  KIDS = 'Toys & Kids',
  OUTDOOR = 'Sports & Outdoor'
}

export interface GeneratedReplyOption {
  type: ReplyType;
  headline: string; // Chinese Headline
  bodyEnglish: string; // The generated English reply
  bodyChinese: string; // The translation for the user
  toneAnalysis: string; // Chinese analysis
}

export interface GenerationResult {
  classification: ReviewClassification;
  riskScore: number; // 0-100 score of risk
  reviewSummary: string;
  complianceNotes: string;
  options: GeneratedReplyOption[];
}

export interface ReviewContext {
  customerName?: string;
  productName?: string;
  keyPointsToAddress?: string;
  category?: ProductCategory;
  customRules?: string; // New: Global custom instructions
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalReview: string;
  platform: Platform;
  result: GenerationResult;
}

export interface SavedTemplate {
  id: string;
  title: string;
  contentEnglish: string; // Changed from 'content' to specify English
  contentChinese?: string; // Optional translation for saved templates
  category: TemplateCategory;
  platform: Platform;
  createdAt: number;
  tags?: string[];
}
