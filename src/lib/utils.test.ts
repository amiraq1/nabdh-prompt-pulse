import { describe, it, expect } from 'vitest';
import { cn, getOptimizedImageUrl } from './utils';

describe('utils', () => {
  // 1. ������ ���� ��� �������� (Tailwind Merge)
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('bg-red-500', 'text-white');
      expect(result).toBe('bg-red-500 text-white');
    });

    it('should handle conditional classes', () => {
      const condition = true;
      const result = cn('base-class', condition && 'active-class', !condition && 'inactive-class');
      expect(result).toBe('base-class active-class');
    });

    it('should resolve tailwind conflicts', () => {
      // ������ �� �� p-4 ���� p-2
      const result = cn('p-2', 'p-4');
      expect(result).toBe('p-4');
    });
  });

  // 2. ������ ���� ����� ����� (Image Optimization)
  describe('getOptimizedImageUrl', () => {
    it('should return empty string for null/undefined', () => {
      expect(getOptimizedImageUrl(null)).toBe('');
      expect(getOptimizedImageUrl(undefined)).toBe('');
    });

    it('should optimize Supabase storage URLs', () => {
      const url = 'https://xyz.supabase.co/storage/v1/object/public/images/img.jpg';
      const result = getOptimizedImageUrl(url, 500);

      // ����� �� ���� ��������� �������
      expect(result).toContain('?width=500');
      expect(result).toContain('format=webp');
      expect(result).toContain('quality=80');
    });

    it('should NOT modify external URLs (non-Supabase)', () => {
      const url = 'https://example.com/image.jpg';
      const result = getOptimizedImageUrl(url);
      expect(result).toBe(url);
    });
  });
});
