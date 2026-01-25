import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import PromptGrid from '@/components/PromptGrid';
import ErrorBoundary, { InlineError } from '@/components/ErrorBoundary';
import { SortOption } from '@/components/SortSelect';
import { usePrompts } from '@/hooks/usePrompts';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { fuzzySearch, generateSuggestions } from '@/lib/search';
import { cn } from '@/lib/utils';

const Index = () => {
  const { data: prompts = [], isLoading, error, refetch } = usePrompts();
  const { language, isRTL } = useLanguage();
  const t = translations;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Generate search suggestions
  const suggestions = useMemo(() => {
    return generateSuggestions(prompts, searchQuery, 5);
  }, [prompts, searchQuery]);

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    // First apply category and model filters
    let filtered = prompts.filter((prompt) => {
      const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
      const matchesModel = selectedModel === 'all' || prompt.ai_model === selectedModel;
      return matchesCategory && matchesModel;
    });

    // Apply fuzzy search
    if (searchQuery.trim()) {
      filtered = fuzzySearch(filtered, searchQuery, (prompt) => [
        prompt.title,
        prompt.title_ar || '',
        prompt.content,
        ...(prompt.tags ?? []),
      ]);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'popular':
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    return sorted;
  }, [prompts, searchQuery, selectedCategory, selectedModel, sortOption]);

  const getCategoryLabel = () => {
    if (selectedCategory === 'all') {
      return t.allPrompts[language];
    }
    const categoryLabels: Record<string, { en: string; ar: string }> = {
      coding: { en: 'Coding Prompts', ar: 'موجهات البرمجة' },
      writing: { en: 'Writing Prompts', ar: 'موجهات الكتابة' },
      art: { en: 'Art Prompts', ar: 'موجهات الفن' },
      marketing: { en: 'Marketing Prompts', ar: 'موجهات التسويق' },
    };
    return categoryLabels[selectedCategory]?.[language] || t.allPrompts[language];
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          suggestions={suggestions}
        />
        
        <main>
          <HeroSection />
          
          <FilterBar
            selectedCategory={selectedCategory}
            selectedModel={selectedModel}
            sortOption={sortOption}
            onCategoryChange={setSelectedCategory}
            onModelChange={setSelectedModel}
            onSortChange={setSortOption}
          />

          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className={cn(
                "flex items-center justify-between mb-8",
                isRTL && "flex-row-reverse"
              )}>
                <h2 className="text-2xl font-bold text-foreground">
                  {getCategoryLabel()}
                </h2>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {filteredPrompts.length} {filteredPrompts.length === 1 
                    ? (isRTL ? 'موجه' : 'prompt') 
                    : (isRTL ? 'موجهات' : 'prompts')}
                </span>
              </div>

              {error ? (
                <InlineError 
                  message={isRTL ? 'فشل في تحميل الموجهات. حاول مرة أخرى.' : 'Failed to load prompts. Please try again.'}
                  onRetry={() => refetch()}
                />
              ) : (
                <PromptGrid prompts={filteredPrompts} isLoading={isLoading} />
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 {isRTL ? 'نبض' : 'Nabdh'}. {t.footerText[language]}
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
