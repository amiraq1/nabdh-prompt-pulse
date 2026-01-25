import { ArrowUpDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SortOption = 'newest' | 'oldest' | 'popular' | 'likes';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions = {
  newest: { en: 'Newest First', ar: 'الأحدث أولاً' },
  oldest: { en: 'Oldest First', ar: 'الأقدم أولاً' },
  popular: { en: 'Most Popular', ar: 'الأكثر شعبية' },
  likes: { en: 'Most Liked', ar: 'الأكثر إعجاباً' },
};

const SortSelect = ({ value, onChange }: SortSelectProps) => {
  const { language, isRTL } = useLanguage();

  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className={cn(
        "w-full md:w-[180px] bg-secondary border-border/50",
        isRTL && "flex-row-reverse"
      )}>
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-card border-border z-50">
        {(Object.entries(sortOptions) as [SortOption, { en: string; ar: string }][]).map(([key, labels]) => (
          <SelectItem key={key} value={key}>
            {labels[language]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
