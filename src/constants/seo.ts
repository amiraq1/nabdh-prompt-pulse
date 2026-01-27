export type SeoLanguage = "en" | "ar";

export const SEO_CONFIG = {
  siteName: {
    en: "Nabdh",
    ar: "نبض",
  },
  siteUrl: "https://amiraq.online",
  twitterHandle: "@Nabdh",
  defaultTitle: {
    en: "AI Prompt Library",
    ar: "مكتبة موجهات الذكاء الاصطناعي",
  },
  defaultDescription: {
    en: "Nabdh is an AI prompt library in Arabic and English. Discover, copy, and share prompts for GPT-4, Claude, Midjourney, Gemini, and more.",
    ar: "نبض مكتبة عربية/إنجليزية لموجهات الذكاء الاصطناعي. اكتشف ونسخ وشارك موجهات لـ GPT-4 وClaude وMidjourney وGemini وأكثر.",
  },
  defaultImage: "/og-cover.svg",
};

export const buildSeoTitle = (title: string | undefined, lang: SeoLanguage) => {
  const brand = SEO_CONFIG.siteName[lang];
  const fallback = SEO_CONFIG.defaultTitle[lang];
  const base = title?.trim() || fallback;

  if (base.includes(brand)) {
    return base;
  }

  return `${base} — ${brand}`;
};

export const toAbsoluteUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const normalized = url.startsWith("/") ? url : `/${url}`;
  return `${SEO_CONFIG.siteUrl}${normalized}`;
};
