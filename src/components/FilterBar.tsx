import { memo, useCallback, useMemo } from 'react';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SortSelect, { SortOption } from './SortSelect';

interface FilterBarProps {
  selectedCategory: string;
  selectedModel: string;
  sortOption: SortOption;
  onCategoryChange: (category: string) => void;
  onModelChange: (model: string) => void;
  onSortChange: (sort: SortOption) => void;
}

const categories = [
  { id: 'all', en: 'All', ar: 'الكل' },
  { id: 'coding', en: 'Coding', ar: 'البرمجة' },
  { id: 'writing', en: 'Writing', ar: 'الكتابة' },
  { id: 'art', en: 'Art', ar: 'الفن' },
  { id: 'marketing', en: 'Marketing', ar: 'التسويق' }
] as const;

const models = [
  { id: 'all', en: 'All Models', ar: 'كل النماذج' },
  { id: 'gpt-4', en: 'GPT-4', ar: 'GPT-4' },
  { id: 'gpt-3.5', en: 'GPT-3.5', ar: 'GPT-3.5' },
  { id: 'midjourney', en: 'Midjourney', ar: 'Midjourney' },
  { id: 'claude', en: 'Claude', ar: 'Claude' },
  { id: 'gemini', en: 'Gemini', ar: 'Gemini' }
] as const;

// Memoized category button
const CategoryButton = memo(({ 
  category, 
  isSelected, 
  language, 
  onClick 
}: { 
  category: typeof categories[number];
  isSelected: boolean;
  language: 'en' | 'ar';
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 touch-target",
      isSelected
        ? "bg-primary text-primary-foreground glow-sm"
        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50 active:scale-95"
    )}
  >
    {language === 'ar' ? category.ar : category.en}
  </button>
));
CategoryButton.displayName = 'CategoryButton';

const FilterBar = memo(({
  selectedCategory,
  selectedModel,
  sortOption,
  onCategoryChange,
  onModelChange,
  onSortChange,
}: FilterBarProps) => {
  const { language, isRTL } = useLanguage();
  const t = translations;

  // Memoize category click handlers to prevent re-renders
  const handleCategoryClick = useCallback((categoryId: string) => {
    onCategoryChange(categoryId);
  }, [onCategoryChange]);

  // Memoize model items
  const modelItems = useMemo(() => (
    models.map((model) => (
      <SelectItem key={model.id} value={model.id} className="h-11 sm:h-10">
        {language === 'ar' ? model.ar : model.en}
      </SelectItem>
    ))
  ), [language]);

  return (
    <div className="py-4 sm:py-6 border-b border-border/50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className={cn(
          "flex flex-col gap-3 sm:gap-4",
          isRTL && "items-end"
        )}>
          {/* Category Chips */}
          <div className={cn(
            "flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible",
            isRTL && "flex-row-reverse"
          )}>
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                language={language}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>

          {/* Model and Sort Selectors */}
          <div className={cn(
            "flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto",
            isRTL && "sm:flex-row-reverse"
          )}>
            <Select value={selectedModel} onValueChange={onModelChange}>
              <SelectTrigger className={cn(
                "w-full xs:w-[160px] sm:w-[180px] bg-secondary border-border/50 h-11 sm:h-10 text-sm",
                isRTL && "text-right"
              )}>
                <SelectValue placeholder={t.selectModel[language]} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {modelItems}
              </SelectContent>
            </Select>

            <SortSelect value={sortOption} onChange={onSortChange} />
          </div>
        </div>
      </div>
    </div>
  );
});

FilterBar.displayName = 'FilterBar';

export default FilterBar;
