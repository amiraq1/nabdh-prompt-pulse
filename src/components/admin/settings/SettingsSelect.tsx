import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface SelectOption {
  value: string;
  label: string;
}

interface SettingsSelectProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SettingsSelect({
  id,
  label,
  description,
  value,
  options,
  onChange,
  disabled = false,
}: SettingsSelectProps) {
  const { isRTL } = useLanguage();

  return (
    <div className={cn(
      "flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 border border-border/50 transition-all hover:bg-secondary/50",
      isRTL && "flex-row-reverse"
    )}>
      <div className={cn("space-y-0.5", isRTL && "text-right")}>
        <Label htmlFor={id} className="text-foreground font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger 
          id={id}
          className={cn(
            "w-[160px] bg-secondary border-border",
            isRTL && "flex-row-reverse"
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
