import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOptimizedImageUrl(
  url: string | null | undefined,
  width: number = 400
): string {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('supabase.co')) return url;

    const objectPrefix = '/storage/v1/object/public/';
    if (!parsed.pathname.includes(objectPrefix)) return url;

    parsed.pathname = parsed.pathname.replace(
      objectPrefix,
      '/storage/v1/render/image/public/'
    );
    parsed.searchParams.set('width', String(width));
    parsed.searchParams.set('format', 'webp');
    parsed.searchParams.set('quality', '80');

    return parsed.toString();
  } catch {
    return url;
  }
}
