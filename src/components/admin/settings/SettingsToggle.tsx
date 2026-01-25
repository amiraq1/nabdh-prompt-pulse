import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface SettingsToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SettingsToggle({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: SettingsToggleProps) {
  const { isRTL } = useLanguage();

  return (
    <div className={cn(
      "flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 border border-border/50 transition-all hover:bg-secondary/50",
      isRTL && "flex-row-reverse"
    )}>
      <div className={cn("space-y-0.5", isRTL && "text-right")}>
        <Label 
          htmlFor={id} 
          className="text-foreground font-medium cursor-pointer"
        >
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
}
