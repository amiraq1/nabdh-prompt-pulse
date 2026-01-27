import { memo } from 'react';
import { motion } from 'framer-motion';
import { Prompt } from '@/hooks/usePrompts';
import PromptCard from './PromptCard';
import { PromptCardSkeleton } from '@/components/ui/skeleton';
import { Inbox } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/useLanguage';

interface PromptGridProps {
  prompts: Prompt[];
  isLoading?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'tween', duration: 0.3 } },
};

// Memoized skeleton grid
const SkeletonGrid = memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 lg:gap-6 auto-rows-fr">
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

  if (isLoading) {
    return <SkeletonGrid />;
  }

  if (prompts.length === 0) {
    return <EmptyState language={language} />;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 lg:gap-6 auto-rows-fr"
    >
      {prompts.map((prompt, index) => (
        <motion.div key={prompt.id} variants={item} className="will-change-transform">
          <PromptCard prompt={prompt} prioritizeImage={index === 0} />
        </motion.div>
      ))}
    </motion.div>
  );
});

PromptGrid.displayName = 'PromptGrid';

export default PromptGrid;
