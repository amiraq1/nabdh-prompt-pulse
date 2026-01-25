import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import PromptGrid from '@/components/PromptGrid';
import { usePrompts } from '@/hooks/usePrompts';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const { data: prompts = [], isLoading, error } = usePrompts();
  const { language, isRTL } = useLanguage();
  const t = translations;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prompt.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ?? false);

      // Category filter
      const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;

      // Model filter
      const matchesModel = selectedModel === 'all' || prompt.ai_model === selectedModel;

      return matchesSearch && matchesCategory && matchesModel;
    });
  }, [prompts, searchQuery, selectedCategory, selectedModel]);

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
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main>
        <HeroSection />
        
        <FilterBar
          selectedCategory={selectedCategory}
          selectedModel={selectedModel}
          onCategoryChange={setSelectedCategory}
          onModelChange={setSelectedModel}
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
              <span className="text-sm text-muted-foreground">
                {filteredPrompts.length} {filteredPrompts.length === 1 
                  ? (isRTL ? 'موجه' : 'prompt') 
                  : (isRTL ? 'موجهات' : 'prompts')}
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive">
                  {isRTL ? 'فشل في تحميل الموجهات. حاول مرة أخرى.' : 'Failed to load prompts. Please try again.'}
                </p>
              </div>
            ) : (
              <PromptGrid prompts={filteredPrompts} />
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
  );
};

export default Index;
