import { CategoryType } from '../types';

export interface CategoryRule {
  regex: RegExp;
  category: CategoryType;
  ruleDescription: string;
  icon: string;
}

export const CATEGORY_RULES: CategoryRule[] = [
  // Food & Dining
  {
    regex: /swiggy|zomato|burger|pizza|biryani|subway|mcdonalds|kfc|dominos|starbucks|coffee|chai|tea|bakery|deli|dining|restaurant|truffles|lunch|dinner|breakfast|food|snack|blinkit|zepto|instamart|grocery|supermarket|fruits|vegetables/i,
    category: 'Food',
    ruleDescription: 'Dining / Food & Grocery merchant',
    icon: 'lunch_dining',
  },
  // Travel & Commute
  {
    regex: /uber|ola|rapido|metro|airport|flight|indigo|air india|vistara|spicejet|train|irctc|petrol|fuel|shell|hpcl|bpcl|ioc|toll|fastag|bus|redbus|auto|cab|commute|ride|parking/i,
    category: 'Travel',
    ruleDescription: 'Transit, Ride & Fuel keyword',
    icon: 'local_taxi',
  },
  // Shopping & Retail
  {
    regex: /amazon|flipkart|myntra|ajio|meesho|zara|h&m|uniqlo|clothing|shoes|electronics|echo|headphone|gadget|laptop|croma|reliance digital|mall|shopping|apparel|dock|monitor/i,
    category: 'Shopping',
    ruleDescription: 'E-commerce & Retail store',
    icon: 'shopping_bag',
  },
  // Bills & Utilities
  {
    regex: /bescom|electricity|bill|water|bwssb|wifi|broadband|airtel|jio|vi|vodafone|maintenance|society|rent|lpg|gas|cylinder|dth|tata play|recharge|cylinder/i,
    category: 'Bills',
    ruleDescription: 'Utilities, Bills & Subscriptions',
    icon: 'bolt',
  },
  // Entertainment
  {
    regex: /netflix|prime|hotstar|disney|spotify|youtube|cinema|pvr|inox|movie|show|bookmyshow|game|steam|playstation|xbox|theatre|concert/i,
    category: 'Entertainment',
    ruleDescription: 'Streaming, Movies & Entertainment',
    icon: 'movie',
  },
];

export interface CategoryMeta {
  name: CategoryType;
  color: string;
  bgColor: string;
  dotColor: string;
  badgeBg: string;
  icon: string;
}

export const CATEGORY_META: Record<CategoryType, CategoryMeta> = {
  Food: {
    name: 'Food',
    color: '#004ac6',
    bgColor: '#e5eeff',
    dotColor: '#004ac6',
    badgeBg: 'bg-primary/10 text-primary',
    icon: 'lunch_dining',
  },
  Travel: {
    name: 'Travel',
    color: '#4b41e1',
    bgColor: '#e2dfff',
    dotColor: '#4b41e1',
    badgeBg: 'bg-secondary/10 text-secondary',
    icon: 'local_taxi',
  },
  Shopping: {
    name: 'Shopping',
    color: '#005a82',
    bgColor: '#c9e6ff',
    dotColor: '#005a82',
    badgeBg: 'bg-tertiary/10 text-tertiary',
    icon: 'shopping_bag',
  },
  Bills: {
    name: 'Bills',
    color: '#ba1a1a',
    bgColor: '#ffdad6',
    dotColor: '#ba1a1a',
    badgeBg: 'bg-error/10 text-error',
    icon: 'bolt',
  },
  Entertainment: {
    name: 'Entertainment',
    color: '#645efb',
    bgColor: '#f0eeff',
    dotColor: '#645efb',
    badgeBg: 'bg-secondary-container/15 text-secondary-container',
    icon: 'movie',
  },
  Others: {
    name: 'Others',
    color: '#737686',
    bgColor: '#f1f5f9',
    dotColor: '#737686',
    badgeBg: 'bg-outline/10 text-outline',
    icon: 'receipt',
  },
};

export function detectCategoryFromText(text: string): {
  category: CategoryType;
  matchRule?: string;
  extractedAmount?: number;
} {
  const clean = text.trim();
  if (!clean) {
    return { category: 'Others' };
  }

  // Extract amount if user entered e.g. "Swiggy ₹450" or "uber 350"
  let extractedAmount: number | undefined;
  const amountMatch = clean.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
  if (amountMatch && amountMatch[1]) {
    const parsed = parseFloat(amountMatch[1].replace(/,/g, ''));
    if (!isNaN(parsed) && parsed > 0) {
      extractedAmount = parsed;
    }
  }

  for (const rule of CATEGORY_RULES) {
    if (rule.regex.test(clean)) {
      return {
        category: rule.category,
        matchRule: rule.ruleDescription,
        extractedAmount,
      };
    }
  }

  return { category: 'Others', extractedAmount };
}
