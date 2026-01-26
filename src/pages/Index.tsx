import { useState, useCallback, useDeferredValue } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import PromptGrid from '@/components/PromptGrid';
import ErrorBoundary, { InlineError } from '@/components/ErrorBoundary';
import { SortOption } from '@/components/SortSelect';
import { usePrompts } from '@/hooks/usePrompts';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { language, isRTL } = useLanguage();
  const t = translations;

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery); // تأخير البحث قليلاً لتحسين الأداء
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // استخدام Hook الجديد مع الترحيل اللانهائي
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = usePrompts(deferredQuery, selectedCategory, selectedModel);

  // دمج الصفحات في مصفوفة واحدة للعرض
  const allPrompts = data?.pages.flatMap(page => page) ?? [];

  const handleSearchChange = useCallback((query: string) => setSearchQuery(query), []);
  const handleCategoryChange = useCallback((cat: string) => setSelectedCategory(cat), []);
  const handleModelChange = useCallback((model: string) => setSelectedModel(model), []);
  const handleSortChange = useCallback((sort: SortOption) => setSortOption(sort), []);

  // دالة لفرز البيانات محلياً للنتائج الظاهرة
  const sortedPrompts = [...allPrompts].sort((a, b) => {
    if (sortOption === 'popular' || sortOption === 'likes') return b.likes - a.likes;
    if (sortOption === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

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
      <div className="min-h-screen bg-background pb-20">
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          suggestions={[]} // ألغينا الاقتراحات المحلية مؤقتاً للسرعة
        />

        <main>
          <HeroSection />

          <FilterBar
            selectedCategory={selectedCategory}
            selectedModel={selectedModel}
            sortOption={sortOption}
            onCategoryChange={handleCategoryChange}
            onModelChange={handleModelChange}
            onSortChange={handleSortChange}
          />

          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className={cn("flex items-center justify-between mb-8", isRTL && "flex-row-reverse")}>
                <h2 className="text-2xl font-bold text-foreground">{getCategoryLabel()}</h2>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {allPrompts.length}+ {isRTL ? 'موجه' : 'prompts'}
                </span>
              </div>

              {error ? (
                <InlineError
                  message={isRTL ? 'حدث خطأ' : 'Error loading prompts'}
                  onRetry={() => refetch()}
                />
              ) : (
                <>
                  <PromptGrid prompts={sortedPrompts} isLoading={isLoading} />

                  {/* زر تحميل المزيد / مؤشر التحميل */}
                  <div className="mt-12 flex justify-center">
                    {isFetchingNextPage ? (
                      <div className="flex items-center gap-2 text-primary">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>{isRTL ? 'جاري التحميل...' : 'Loading more...'}</span>
                      </div>
                    ) : hasNextPage ? (
                      <button
                        onClick={() => fetchNextPage()}
                        className="px-6 py-3 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors font-medium border border-border"
                      >
                        {isRTL ? 'تحميل المزيد' : 'Load More'}
                      </button>
                    ) : allPrompts.length > 0 ? (
                      <p className="text-muted-foreground text-sm">
                        {isRTL ? 'وصلت لنهاية القائمة' : 'You have reached the end'}
                      </p>
                    ) : null}
                  </div>
                </>
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
