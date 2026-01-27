/**
 * دالة لتحويل أي رابط صورة إلى صيغة WebP وبحجم مخصص
 * @param url رابط الصورة الأصلي
 * @param width العرض المطلوب (لتحسين الأداء)
 */
export function getOptimizedImageUrl(url: string | null | undefined, width: number = 640): string {
  if (!url) return "/placeholder.svg"; // صورة افتراضية

  // تجاهل الصور المحلية (Data URI) أو الرموز
  if (url.startsWith("data:") || url.startsWith("/placeholder")) return url;

  try {
    const urlObj = new URL(url);

    // 1. تحسين صور Unsplash (مدمج)
    if (urlObj.hostname.includes("unsplash.com")) {
      urlObj.searchParams.set("w", width.toString());
      urlObj.searchParams.set("q", "80");      // الجودة
      urlObj.searchParams.set("fm", "webp");   // 👈 التحويل لـ WebP
      urlObj.searchParams.set("auto", "format");
      return urlObj.toString();
    }

    // 2. تحسين صور Supabase Storage
    if (urlObj.hostname.endsWith("supabase.co") && urlObj.pathname.includes("/storage/v1/object/public")) {
      // نستخدم ميزة Image Transformation في Supabase
      const newPath = urlObj.pathname.replace("/storage/v1/object/public", "/storage/v1/render/image/public");
      const newUrl = new URL(urlObj.origin + newPath);
      newUrl.searchParams.set("width", width.toString());
      newUrl.searchParams.set("resize", "contain");
      newUrl.searchParams.set("format", "webp"); // 👈 التحويل لـ WebP
      newUrl.searchParams.set("quality", "80");
      return newUrl.toString();
    }
    
    // 3. الصور الخارجية الأخرى (نستخدم wsrv.nl كوكيل مجاني وسريع للتحويل)
    if (!url.includes("localhost") && !url.includes("127.0.0.1")) {
       return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=80`;
    }

    return url;
  } catch (e) {
    console.error("Image optimization failed:", e);
    return url;
  }
}
