import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Smart image optimizer
 * Converts to WebP and resizes for better performance
 */
export function getOptimizedImageUrl(url: string | null | undefined, width: number = 640): string {
  if (!url) return "/placeholder.svg";

  // Ignore local/data URLs
  if (url.startsWith("data:") || url.startsWith("/placeholder")) return url;

  try {
    const urlObj = new URL(url);

    // 1) Unsplash optimization
    if (urlObj.hostname.includes("unsplash.com")) {
      urlObj.searchParams.set("w", width.toString());
      urlObj.searchParams.set("q", "80");
      urlObj.searchParams.set("fm", "webp");
      urlObj.searchParams.set("auto", "format");
      return urlObj.toString();
    }

    // 2) Supabase Storage image transformations
    if (urlObj.hostname.endsWith("supabase.co") && urlObj.pathname.includes("/storage/v1/object/public")) {
      const newPath = urlObj.pathname.replace(
        "/storage/v1/object/public",
        "/storage/v1/render/image/public"
      );
      const newUrl = new URL(urlObj.origin + newPath);
      newUrl.searchParams.set("width", width.toString());
      newUrl.searchParams.set("resize", "contain");
      newUrl.searchParams.set("format", "webp");
      newUrl.searchParams.set("quality", "80");
      return newUrl.toString();
    }

    // 3) External images via wsrv.nl (skip localhost)
    if (!url.includes("localhost") && !url.includes("127.0.0.1")) {
      return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=80`;
    }

    return url;
  } catch {
    return url;
  }
}

