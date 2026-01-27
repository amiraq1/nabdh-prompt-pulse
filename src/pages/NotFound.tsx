import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import Seo from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();
  const { isRTL } = useLanguage();

  const pageTitle = isRTL ? "الصفحة غير موجودة" : "Page not found";
  const pageDescription = isRTL
    ? "عذرًا، لم نتمكن من العثور على الصفحة المطلوبة."
    : "Sorry, we couldn't find the page you're looking for.";

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Seo title={pageTitle} description={pageDescription} noIndex />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          {isRTL ? "عذرًا، الصفحة غير موجودة" : "Oops! Page not found"}
        </p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          {isRTL ? "العودة إلى الرئيسية" : "Return to Home"}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
