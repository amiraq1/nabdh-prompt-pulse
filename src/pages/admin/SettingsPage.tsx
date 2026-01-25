import { useState, useEffect, useCallback } from 'react';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bell, 
  LayoutGrid,
  RotateCcw,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { 
  useSettings, 
  useAutoSaveSettings, 
  useResetSettings,
  AppSettings,
  DEFAULT_SETTINGS 
} from '@/hooks/useSettings';
import { SettingsSection } from '@/components/admin/settings/SettingsSection';
import { SettingsToggle } from '@/components/admin/settings/SettingsToggle';
import { SettingsSelect } from '@/components/admin/settings/SettingsSelect';
import { SaveIndicator } from '@/components/admin/settings/SaveIndicator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const SettingsPage = () => {
  const { language, isRTL, setLanguage } = useLanguage();
  const t = translations;
  
  const { data, isLoading, error, refetch } = useSettings();
  const { debouncedSave, isPending } = useAutoSaveSettings();
  const { reset: resetSettings, isPending: isResetting } = useResetSettings();
  
  const [localSettings, setLocalSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  // Sync local state with fetched data
  useEffect(() => {
    if (data?.settings) {
      setLocalSettings(data.settings);
      setHasLocalChanges(false);
    }
  }, [data?.settings]);

  // Update a setting and trigger auto-save
  const updateSetting = useCallback(<K extends keyof AppSettings>(
    section: K,
    key: keyof AppSettings[K],
    value: AppSettings[K][keyof AppSettings[K]]
  ) => {
    const newSettings = {
      ...localSettings,
      [section]: {
        ...localSettings[section],
        [key]: value,
      },
    };
    setLocalSettings(newSettings);
    setHasLocalChanges(true);
    debouncedSave(newSettings);
  }, [localSettings, debouncedSave]);

  // Handle language toggle specially since it affects LanguageContext
  const handleLanguageChange = useCallback((showArabic: boolean) => {
    updateSetting('appearance', 'showArabicTitles', showArabic);
    // Also update the global language context if turning on Arabic
    if (showArabic && language !== 'ar') {
      setLanguage('ar');
    }
  }, [updateSetting, language, setLanguage]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className={cn("mb-6", isRTL && "text-right")}>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {isRTL ? 'فشل في تحميل الإعدادات' : 'Failed to load settings'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {isRTL ? 'حدث خطأ أثناء تحميل الإعدادات. حاول مرة أخرى.' : 'An error occurred while loading settings. Please try again.'}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {isRTL ? 'إعادة المحاولة' : 'Try Again'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className={cn(
        "flex items-start justify-between mb-6",
        isRTL && "flex-row-reverse"
      )}>
        <div className={isRTL ? "text-right" : ""}>
          <h1 className="text-2xl font-bold text-foreground">{t.settings[language]}</h1>
          <p className="text-muted-foreground">{t.manageLibrary[language]}</p>
        </div>
        <SaveIndicator 
          isPending={isPending} 
          lastSaved={data?.updatedAt}
          hasChanges={hasLocalChanges}
        />
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <SettingsSection
          icon={Palette}
          title={t.appearance[language]}
          description={isRTL ? 'تخصيص مظهر التطبيق' : 'Customize how the app looks'}
        >
          <SettingsToggle
            id="showArabicTitles"
            label={t.showArabicTitles[language]}
            description={t.showArabicDescription[language]}
            checked={localSettings.appearance.showArabicTitles}
            onChange={(checked) => handleLanguageChange(checked)}
          />
          
          <SettingsSelect
            id="theme"
            label={isRTL ? 'السمة' : 'Theme'}
            description={isRTL ? 'اختر سمة الألوان' : 'Choose your color theme'}
            value={localSettings.appearance.theme}
            options={[
              { value: 'dark', label: isRTL ? 'داكن' : 'Dark' },
              { value: 'light', label: isRTL ? 'فاتح' : 'Light' },
              { value: 'system', label: isRTL ? 'تلقائي' : 'System' },
            ]}
            onChange={(value) => updateSetting('appearance', 'theme', value as AppSettings['appearance']['theme'])}
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection
          icon={Bell}
          title={t.notifications[language]}
          description={isRTL ? 'إدارة تفضيلات الإشعارات' : 'Manage notification preferences'}
        >
          <SettingsToggle
            id="newSubmissionAlerts"
            label={t.newSubmissionAlerts[language]}
            description={t.notifySubmissions[language]}
            checked={localSettings.notifications.newSubmissionAlerts}
            onChange={(checked) => updateSetting('notifications', 'newSubmissionAlerts', checked)}
          />
          
          <SettingsToggle
            id="emailDigest"
            label={isRTL ? 'ملخص البريد الإلكتروني' : 'Email Digest'}
            description={isRTL ? 'تلقي ملخص أسبوعي للنشاط' : 'Receive weekly activity summary'}
            checked={localSettings.notifications.emailDigest}
            onChange={(checked) => updateSetting('notifications', 'emailDigest', checked)}
          />
        </SettingsSection>

        {/* Display Section */}
        <SettingsSection
          icon={LayoutGrid}
          title={isRTL ? 'العرض' : 'Display'}
          description={isRTL ? 'تخصيص كيفية عرض المحتوى' : 'Customize how content is displayed'}
        >
          <SettingsSelect
            id="promptsPerPage"
            label={isRTL ? 'الموجهات في الصفحة' : 'Prompts per page'}
            description={isRTL ? 'عدد الموجهات المعروضة' : 'Number of prompts to show'}
            value={String(localSettings.display.promptsPerPage)}
            options={[
              { value: '12', label: '12' },
              { value: '24', label: '24' },
              { value: '48', label: '48' },
            ]}
            onChange={(value) => updateSetting('display', 'promptsPerPage', Number(value) as AppSettings['display']['promptsPerPage'])}
          />
          
          <SettingsSelect
            id="defaultSortOrder"
            label={isRTL ? 'الترتيب الافتراضي' : 'Default sort order'}
            description={isRTL ? 'كيفية ترتيب الموجهات' : 'How prompts are ordered'}
            value={localSettings.display.defaultSortOrder}
            options={[
              { value: 'newest', label: isRTL ? 'الأحدث' : 'Newest' },
              { value: 'oldest', label: isRTL ? 'الأقدم' : 'Oldest' },
              { value: 'popular', label: isRTL ? 'الأكثر شعبية' : 'Most Popular' },
            ]}
            onChange={(value) => updateSetting('display', 'defaultSortOrder', value as AppSettings['display']['defaultSortOrder'])}
          />
        </SettingsSection>

        {/* Actions */}
        <div className={cn(
          "flex items-center gap-4 pt-4 border-t border-border",
          isRTL && "flex-row-reverse"
        )}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className={cn("border-border hover:bg-secondary", isRTL && "flex-row-reverse")}
                disabled={isResetting}
              >
                <RotateCcw className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                {t.resetDefaults[language]}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle className={isRTL ? "text-right" : ""}>
                  {isRTL ? 'إعادة تعيين الإعدادات؟' : 'Reset Settings?'}
                </AlertDialogTitle>
                <AlertDialogDescription className={isRTL ? "text-right" : ""}>
                  {isRTL 
                    ? 'سيتم إعادة جميع الإعدادات إلى القيم الافتراضية. لا يمكن التراجع عن هذا الإجراء.'
                    : 'This will reset all settings to their default values. This action cannot be undone.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
                <AlertDialogCancel className="border-border">
                  {t.cancel[language]}
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={resetSettings}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isRTL ? 'إعادة التعيين' : 'Reset'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
