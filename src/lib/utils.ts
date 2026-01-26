import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOptimizedImageUrl(url: string | null | undefined, width: number = 400): string {
  if (!url) return '';

  // التحقق مما إذا كانت الصورة مستضافة على Supabase
  if (url.includes('supabase.co')) {
    // إذا كانت الصورة مدعومة بخدمة التحويل (Image Transformation)
    // نطلب الصورة بصيغة WebP وبحجم محدد (width) لتقليل الحجم بنسبة 80%
    return `${url}?width=${width}&format=webp&quality=80`;
  }

  return url;
}
