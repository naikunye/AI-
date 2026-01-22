
import { Platform, Tone, ReviewClassification, Resolution, ReplyType, ReplyLength, EmojiLevel, LanguageStyle, ProductCategory } from './types';
import { ShoppingBag, MessageSquare, ShoppingCart, Globe, Heart, Briefcase, Smile, ShieldAlert, Gift, Gavel, RefreshCw, Undo2, Headphones, ThumbsUp, ThumbsDown, Minus, AlignJustify, AlignLeft, AlignRight, SmilePlus, Monitor, Shirt, SprayCan, Home, Baby, Tent } from 'lucide-react';

export const PLATFORM_CONFIG = {
  [Platform.AMAZON]: {
    label: "亚马逊 (Amazon)",
    icon: ShoppingBag,
    rules: "严格禁止外部链接，禁止私下联系引导，禁止利诱好评。保持专业距离。"
  },
  [Platform.TIKTOK_SHOP]: {
    label: "TikTok Shop",
    icon: MessageSquare,
    rules: "允许随意、充满活力的语气。鼓励使用表情符号。注重社区感。简短有力。"
  },
  [Platform.SHOPIFY]: {
    label: "独立站 (Shopify)",
    icon: ShoppingCart,
    rules: "品牌导向。语气完全可控。可以提供支持邮箱。专注于客户留存。"
  },
  [Platform.ETSY]: {
    label: "Etsy 手工站",
    icon: Gift,
    rules: "个性化，手作感。强调工匠精神和小企业的感激之情。温暖且诱人。"
  },
  [Platform.GENERAL]: {
    label: "通用/其他平台",
    icon: Globe,
    rules: "标准的专业客户服务规范。"
  }
};

export const TONE_CONFIG = {
  [Tone.PROFESSIONAL]: { label: "专业客观 (Professional)", icon: Briefcase },
  [Tone.EMPATHETIC]: { label: "亲切共情 (Empathetic)", icon: Heart },
  [Tone.WITTY]: { label: "幽默风趣 (Witty)", icon: Smile },
  [Tone.FIRM]: { label: "坚定合规 (Firm)", icon: Gavel },
  [Tone.GRATEFUL]: { label: "热情感谢 (Grateful)", icon: Gift }
};

export const RESOLUTION_CONFIG = {
  [Resolution.NONE]: { label: "无 / 仅回复", icon: Minus },
  [Resolution.SUPPORT]: { label: "标准售后支持", icon: Headphones },
  [Resolution.REFUND_ONLY]: { label: "仅退款 (Refund)", icon: Undo2 },
  [Resolution.REFUND_KEEP]: { label: "退款不退货 (Refund & Keep)", icon: Gift },
  [Resolution.REPLACEMENT]: { label: "补发新品 (Replacement)", icon: RefreshCw },
};

// Colors updated for Dark Mode Tech Theme
export const CLASSIFICATION_CONFIG = {
  [ReviewClassification.POSITIVE]: { 
    label: "正面好评", 
    icon: ThumbsUp, 
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
  },
  [ReviewClassification.NEUTRAL]: { 
    label: "中立评价", 
    icon: Minus, 
    color: "text-slate-300 bg-slate-500/10 border-slate-500/20" 
  },
  [ReviewClassification.NEGATIVE]: { 
    label: "负面差评", 
    icon: ThumbsDown, 
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]" 
  },
  [ReviewClassification.HIGH_RISK]: { 
    label: "高风险/纠纷", 
    icon: ShieldAlert, 
    color: "text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
  },
};

export const REPLY_TYPE_LABELS = {
  [ReplyType.PUBLIC]: "公开回复 (Public)",
  [ReplyType.PRIVATE]: "私信/邮件 (Private)"
};

// --- NEW CONSTANTS ---

export const LENGTH_CONFIG = {
  [ReplyLength.SHORT]: { label: "简短", icon: AlignJustify },
  [ReplyLength.MEDIUM]: { label: "适中", icon: AlignLeft },
  [ReplyLength.LONG]: { label: "详细", icon: AlignRight },
};

export const EMOJI_CONFIG = {
  [EmojiLevel.NONE]: { label: "无", icon: Minus },
  [EmojiLevel.MINIMAL]: { label: "少", icon: Smile },
  [EmojiLevel.HEAVY]: { label: "多", icon: SmilePlus },
};

export const STYLE_CONFIG = {
  [LanguageStyle.NATIVE_US]: { label: "美式地道" },
  [LanguageStyle.BRITISH_FORMAL]: { label: "英式正式" },
  [LanguageStyle.GEN_Z]: { label: "Z世代/俚语" },
  [LanguageStyle.SIMPLE_ENGLISH]: { label: "简单英语" },
};

export const CATEGORY_CONFIG = {
  [ProductCategory.GENERAL]: { label: "通用商品", icon: ShoppingBag },
  [ProductCategory.ELECTRONICS]: { label: "3C/电子", icon: Monitor },
  [ProductCategory.FASHION]: { label: "服装/鞋帽", icon: Shirt },
  [ProductCategory.BEAUTY]: { label: "美妆个护", icon: SprayCan },
  [ProductCategory.HOME]: { label: "家居/厨房", icon: Home },
  [ProductCategory.KIDS]: { label: "母婴/玩具", icon: Baby },
  [ProductCategory.OUTDOOR]: { label: "户外/运动", icon: Tent },
};
