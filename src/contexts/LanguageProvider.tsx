import { ReactNode, useEffect, useState } from "react";
import { translations } from "@/constants/translations";
import { Language, LanguageContext } from "./LanguageContext";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("nabdh-language");
    return (saved as Language) || "en";
  });

  const isRTL = language === "ar";

  useEffect(() => {
    localStorage.setItem("nabdh-language", language);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
