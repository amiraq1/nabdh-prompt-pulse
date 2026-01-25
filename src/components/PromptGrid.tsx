import { memo, useMemo } from 'react';
import { Prompt } from '@/hooks/usePrompts';
import PromptCard from './PromptCard';
import { PromptCardSkeleton } from '@/components/ui/skeleton';
import { Inbox } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/LanguageContext';

interface PromptGridProps {
  prompts: Prompt[];
  isLoading?: boolean;
}

// Memoized skeleton grid
const SkeletonGrid = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <PromptCardSkeleton key={index} />
    ))}
  </div>
));
SkeletonGrid.displayName = 'SkeletonGrid';

// Memoized empty state
const EmptyState = memo(({ language }: { language: 'en' | 'ar' }) => {
  const t = translations;
  
  return (
    <div className="py-20 text-center animate-fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
        <Inbox className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{t.noPromptsFound[language]}</h3>
      <p className="text-muted-foreground">{t.adjustFilters[language]}</p>
    </div>
  );
});
EmptyState.displayName = 'EmptyState';

const PromptGrid = memo(({ prompts, isLoading = false }: PromptGridProps) => {
  const { language } = useLanguage();

  // Memoize the grid content to prevent unnecessary re-renders
  const gridContent = useMemo(() => {
    if (prompts.length === 0) return null;
    
    return prompts.map((prompt, index) => (
      <PromptCard key={prompt.id} prompt={prompt} index={index} />
    ));
  }, [prompts]);

  if (isLoading) {
    return <SkeletonGrid />;
  }

  if (prompts.length === 0) {
    return <EmptyState language={language} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gridContent}
    </div>
  );
});

PromptGrid.displayName = 'PromptGrid';

export default PromptGrid;
