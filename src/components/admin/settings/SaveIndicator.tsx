import { Check, Loader2, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/useLanguage';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface SaveIndicatorProps {
  isPending: boolean;
  lastSaved?: string;
  hasChanges?: boolean;
}

export function SaveIndicator({ isPending, lastSaved, hasChanges }: SaveIndicatorProps) {
  const { isRTL, language } = useLanguage();

  const getStatusDisplay = () => {
    if (isPending) {
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        text: isRTL ? 'جاري الحفظ...' : 'Saving...',
        className: 'text-muted-foreground',
      };
    }

    if (hasChanges) {
      return {
        icon: <Cloud className="w-4 h-4" />,
        text: isRTL ? 'تغييرات غير محفوظة' : 'Unsaved changes',
        className: 'text-amber-500',
      };
    }

    const savedText = lastSaved
      ? formatDistanceToNow(new Date(lastSaved), {
          addSuffix: true,
          locale: language === 'ar' ? ar : enUS,
        })
      : '';

    return {
      icon: <Check className="w-4 h-4" />,
      text: isRTL ? `تم الحفظ ${savedText}` : `Saved ${savedText}`,
      className: 'text-emerald-500',
    };
  };

  const status = getStatusDisplay();

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm transition-all",
      status.className,
      isRTL && "flex-row-reverse"
    )}>
      {status.icon}
      <span>{status.text}</span>
    </div>
  );
}

