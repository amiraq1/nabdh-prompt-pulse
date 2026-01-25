import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

// Settings Schema with defaults
export interface AppSettings {
  appearance: {
    showArabicTitles: boolean;
    theme: 'dark' | 'light' | 'system';
  };
  notifications: {
    newSubmissionAlerts: boolean;
    emailDigest: boolean;
  };
  display: {
    promptsPerPage: 12 | 24 | 48;
    defaultSortOrder: 'newest' | 'oldest' | 'popular';
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  appearance: {
    showArabicTitles: true,
    theme: 'dark',
  },
  notifications: {
    newSubmissionAlerts: true,
    emailDigest: false,
  },
  display: {
    promptsPerPage: 12,
    defaultSortOrder: 'newest',
  },
};

// Singleton settings ID (until auth is implemented)
const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

interface SettingsRow {
  id: string;
  settings: AppSettings;
  schema_version: number;
  updated_at: string;
}

// Fetch settings
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<{ settings: AppSettings; updatedAt: string }> => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', SETTINGS_ID)
        .single();

      if (error) {
        console.warn('Settings not found, using defaults:', error);
        return { settings: DEFAULT_SETTINGS, updatedAt: new Date().toISOString() };
      }

      // Merge with defaults to handle missing fields
      const mergedSettings = mergeWithDefaults(data.settings as unknown as Partial<AppSettings>);
      return { 
        settings: mergedSettings, 
        updatedAt: data.updated_at 
      };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });
};

// Deep merge settings with defaults
function mergeWithDefaults(partial: Partial<AppSettings>): AppSettings {
  return {
    appearance: {
      ...DEFAULT_SETTINGS.appearance,
      ...(partial?.appearance || {}),
    },
    notifications: {
      ...DEFAULT_SETTINGS.notifications,
      ...(partial?.notifications || {}),
    },
    display: {
      ...DEFAULT_SETTINGS.display,
      ...(partial?.display || {}),
    },
  };
}

// Update settings with optimistic updates
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const { isRTL } = useLanguage();

  return useMutation({
    mutationFn: async (newSettings: AppSettings) => {
      const { data, error } = await supabase
        .from('user_settings')
        .update({ settings: JSON.parse(JSON.stringify(newSettings)) })
        .eq('id', SETTINGS_ID)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newSettings) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['settings'] });

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData(['settings']);

      // Optimistically update
      queryClient.setQueryData(['settings'], {
        settings: newSettings,
        updatedAt: new Date().toISOString(),
      });

      return { previousSettings };
    },
    onError: (err, _newSettings, context) => {
      // Rollback on error
      if (context?.previousSettings) {
        queryClient.setQueryData(['settings'], context.previousSettings);
      }
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حفظ الإعدادات' : 'Failed to save settings',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// Debounced auto-save hook
export const useAutoSaveSettings = () => {
  const updateSettings = useUpdateSettings();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSettingsRef = useRef<AppSettings | null>(null);

  const debouncedSave = useCallback((settings: AppSettings) => {
    pendingSettingsRef.current = settings;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (pendingSettingsRef.current) {
        updateSettings.mutate(pendingSettingsRef.current);
        pendingSettingsRef.current = null;
      }
    }, 800); // 800ms debounce
  }, [updateSettings]);

  const cancelPending = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      pendingSettingsRef.current = null;
    }
  }, []);

  return {
    debouncedSave,
    cancelPending,
    isPending: updateSettings.isPending,
    isSuccess: updateSettings.isSuccess,
  };
};

// Reset to defaults
export const useResetSettings = () => {
  const updateSettings = useUpdateSettings();
  const { isRTL } = useLanguage();

  return {
    reset: () => {
      updateSettings.mutate(DEFAULT_SETTINGS, {
        onSuccess: () => {
          toast({
            title: isRTL ? 'تم إعادة التعيين' : 'Settings Reset',
            description: isRTL ? 'تم استعادة الإعدادات الافتراضية' : 'Default settings restored',
          });
        },
      });
    },
    isPending: updateSettings.isPending,
  };
};
