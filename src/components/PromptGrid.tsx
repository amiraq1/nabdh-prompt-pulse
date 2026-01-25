import { Prompt } from '@/hooks/usePrompts';
import PromptCard from './PromptCard';
import { PromptCardSkeleton } from '@/components/ui/skeleton';
import { Inbox } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/LanguageContext';

interface PromptGridProps {
  prompts: Prompt[];
  isLoading?: boolean;
}

const PromptGrid = ({ prompts, isLoading = false }: PromptGridProps) => {
  const { language } = useLanguage();
  const t = translations;

  // Show skeletons while loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <PromptCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="py-20 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
          <Inbox className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">{t.noPromptsFound[language]}</h3>
        <p className="text-muted-foreground">{t.adjustFilters[language]}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt, index) => (
        <PromptCard key={prompt.id} prompt={prompt} index={index} />
      ))}
    </div>
  );
};

export default PromptGrid;
