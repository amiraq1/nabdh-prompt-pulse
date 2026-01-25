import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface SettingsSectionProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({ icon: Icon, title, description, children }: SettingsSectionProps) {
  const { isRTL } = useLanguage();

  return (
    <div className="bg-card rounded-xl border border-border p-6 transition-all hover:border-border/80">
      <div className={cn(
        "flex items-start gap-3 mb-5",
        isRTL && "flex-row-reverse"
      )}>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className={cn("flex-1", isRTL && "text-right")}>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
