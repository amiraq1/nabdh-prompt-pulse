import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const { language, isRTL } = useLanguage();
  const t = translations;

  return (
    <div className="max-w-2xl">
      <div className={cn("mb-6", isRTL && "text-right")}>
        <h1 className="text-2xl font-bold text-foreground">{t.settings[language]}</h1>
        <p className="text-muted-foreground">{t.manageLibrary[language]}</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className={cn(
            "text-lg font-semibold text-foreground mb-4 flex items-center gap-2",
            isRTL && "flex-row-reverse"
          )}>
            <SettingsIcon className="w-5 h-5 text-primary" />
            {t.appearance[language]}
          </h2>
          
          <div className="space-y-4">
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div className={isRTL ? "text-right" : ""}>
                <Label className="text-foreground">{t.rtlMode[language]}</Label>
                <p className="text-sm text-muted-foreground">{t.rtlDescription[language]}</p>
              </div>
              <Switch checked={isRTL} disabled />
            </div>

            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div className={isRTL ? "text-right" : ""}>
                <Label className="text-foreground">{t.showArabicTitles[language]}</Label>
                <p className="text-sm text-muted-foreground">{t.showArabicDescription[language]}</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className={cn("text-lg font-semibold text-foreground mb-4", isRTL && "text-right")}>
            {t.notifications[language]}
          </h2>
          
          <div className="space-y-4">
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div className={isRTL ? "text-right" : ""}>
                <Label className="text-foreground">{t.newSubmissionAlerts[language]}</Label>
                <p className="text-sm text-muted-foreground">{t.notifySubmissions[language]}</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-sm">
            {t.saveChanges[language]}
          </Button>
          <Button variant="outline" className="border-border hover:bg-secondary">
            {t.resetDefaults[language]}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
