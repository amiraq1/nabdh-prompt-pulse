import { createContext } from "react";
import { translations } from "@/constants/translations";

export type Language = "en" | "ar";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: typeof translations;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
