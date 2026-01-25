import { useLanguage, translations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  selectedCategory: string;
  selectedModel: string;
  onCategoryChange: (category: string) => void;
  onModelChange: (model: string) => void;
}

const categories = [
  { id: 'all', en: 'All', ar: 'الكل' },
  { id: 'coding', en: 'Coding', ar: 'البرمجة' },
  { id: 'writing', en: 'Writing', ar: 'الكتابة' },
  { id: 'art', en: 'Art', ar: 'الفن' },
  { id: 'marketing', en: 'Marketing', ar: 'التسويق' }
];

const models = [
  { id: 'all', en: 'All Models', ar: 'كل النماذج' },
  { id: 'gpt-4', en: 'GPT-4', ar: 'GPT-4' },
  { id: 'gpt-3.5', en: 'GPT-3.5', ar: 'GPT-3.5' },
  { id: 'midjourney', en: 'Midjourney', ar: 'Midjourney' },
  { id: 'claude', en: 'Claude', ar: 'Claude' },
  { id: 'gemini', en: 'Gemini', ar: 'Gemini' }
];

const FilterBar = ({
  selectedCategory,
  selectedModel,
  onCategoryChange,
  onModelChange,
}: FilterBarProps) => {
  const { language, isRTL } = useLanguage();
  const t = translations;

  return (
    <div className="py-6 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className={cn(
          "flex flex-col md:flex-row md:items-center justify-between gap-4",
          isRTL && "md:flex-row-reverse"
        )}>
          {/* Category Chips */}
          <div className={cn("flex flex-wrap gap-2", isRTL && "flex-row-reverse")}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground glow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
                )}
              >
                {language === 'ar' ? category.ar : category.en}
              </button>
            ))}
          </div>

          {/* Model Selector */}
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className={cn(
              "w-full md:w-[180px] bg-secondary border-border/50",
              isRTL && "text-right"
            )}>
              <SelectValue placeholder={t.selectModel[language]} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {language === 'ar' ? model.ar : model.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
