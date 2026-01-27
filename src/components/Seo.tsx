import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguage";
import { SEO_CONFIG, buildSeoTitle, toAbsoluteUrl, SeoLanguage } from "@/constants/seo";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  canonicalUrl?: string;
  locale?: string;
  alternateLocales?: string[];
  lang?: SeoLanguage;
}

const Seo = ({
  title,
  description,
  image,
  path,
  type = "website",
  noIndex = false,
  canonicalUrl,
  locale,
  alternateLocales,
  lang,
}: SeoProps) => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const currentLang = lang ?? (language === "ar" ? "ar" : "en");

  const pageTitle = buildSeoTitle(title, currentLang);
  const pageDescription = description?.trim() || SEO_CONFIG.defaultDescription[currentLang];
  const canonical = canonicalUrl || `${SEO_CONFIG.siteUrl}${path || pathname}`;
  const ogImage = toAbsoluteUrl(image || SEO_CONFIG.defaultImage);
  const ogLocale = locale || (currentLang === "ar" ? "ar_AR" : "en_US");
  const ogAlternates = alternateLocales || (currentLang === "ar" ? ["en_US"] : ["ar_AR"]);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}

      <meta property="og:site_name" content={SEO_CONFIG.siteName[currentLang]} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={ogLocale} />
      {ogAlternates.map((alt) => (
        <meta key={alt} property="og:locale:alternate" content={alt} />
      ))}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default Seo;
