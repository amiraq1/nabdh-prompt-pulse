import { useContext } from "react";
import { translations } from "@/constants/translations";
import { LanguageContext } from "./LanguageContext";

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { translations };
