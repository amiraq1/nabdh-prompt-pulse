import { memo, useCallback, useMemo } from 'react';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
    { id: 'art', en: 'Art & Design', ar: 'الفن والتصميم' },
    { id: 'marketing', en: 'Marketing', ar: 'التسويق' },
] as const;

const models = [
    { id: 'all', en: 'All Models', ar: 'كل النماذج' },
    { id: 'gpt-4', en: 'GPT-4', ar: 'GPT-4' },
    { id: 'gpt-3.5', en: 'GPT-3.5', ar: 'GPT-3.5' },
    { id: 'midjourney', en: 'Midjourney', ar: 'Midjourney' },
    { id: 'claude', en: 'Claude', ar: 'Claude' },
    { id: 'gemini', en: 'Gemini', ar: 'Gemini' }
] as const;

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
        <div className="py-4 md:py-6 border-b border-border/50">
            <div className="container mx-auto px-3 sm:px-4">
                <div className={cn(
                    "flex flex-col gap-2 md:gap-4",
                    isRTL && "items-end"
                )}>
                    <div className={cn(
                        "flex gap-2 overflow-x-auto pb-4 pt-2 scrollbar-hide mask-linear-gradient",
                        isRTL && "flex-row-reverse"
                    )}>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleCategoryClick(category.id)}
                                className={cn(
                                    "rounded-full whitespace-nowrap transition-all",
                                    selectedCategory === category.id ? "shadow-md scale-105" : "hover:bg-secondary"
                                )}
                            >
                                {language === 'ar' ? category.ar : category.en}
                            </Button>
                        ))}
                    </div>

                    {/* Model and Sort Selectors */}
                    <div className={cn(
                        "flex flex-col xs:flex-row gap-2 md:gap-4 w-full sm:w-auto",
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
