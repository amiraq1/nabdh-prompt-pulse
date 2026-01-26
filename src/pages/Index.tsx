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

  // States
  const [searchQuery, setSearchQuery] = useState('');
  // تأخير البحث قليلاً لتحسين الأداء (Debounce-like behavior)
  const deferredQuery = useDeferredValue(searchQuery);

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

  // دمج جميع الصفحات القادمة من السيرفر في مصفوفة واحدة للعرض
  const allPrompts = data?.pages.flatMap(page => page) ?? [];

  // دالة الفرز (Sorting) - نقوم بها محلياً على البيانات المحملة
  // (ملاحظة: السيرفر يرسلها مرتبة حسب التاريخ افتراضياً، لكن هنا للتحكم الإضافي)
  const sortedPrompts = [...allPrompts].sort((a, b) => {
    if (sortOption === 'popular' || sortOption === 'likes') return (b.likes || 0) - (a.likes || 0);
    if (sortOption === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    // الافتراضي newest
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleSearchChange = useCallback((query: string) => setSearchQuery(query), []);
  const handleCategoryChange = useCallback((cat: string) => setSelectedCategory(cat), []);
  const handleModelChange = useCallback((model: string) => setSelectedModel(model), []);
  const handleSortChange = useCallback((sort: SortOption) => setSortOption(sort), []);

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
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedCategory === 'all'
                    ? translations.allPrompts[language]
                    : selectedCategory}
                </h2>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {allPrompts.length} {isRTL ? 'موجه' : 'prompts'}
                </span>
              </div>

              {error ? (
                <InlineError
                  message={isRTL ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading prompts'}
                  onRetry={() => refetch()}
                />
              ) : (
                <>
                  <PromptGrid prompts={sortedPrompts} isLoading={isLoading} />

                  {/* زر تحميل المزيد (Load More) */}
                  <div className="mt-12 flex justify-center">
                    {isFetchingNextPage ? (
                      <div className="flex items-center gap-2 text-primary animate-pulse">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>{isRTL ? 'جاري تحميل المزيد...' : 'Loading more...'}</span>
                      </div>
                    ) : hasNextPage ? (
                      <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-8 py-3 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-all font-medium border border-border shadow-sm hover:shadow-md active:scale-95"
                      >
                        {isRTL ? 'عرض المزيد' : 'Load More'}
                      </button>
                    ) : allPrompts.length > 0 ? (
                      <p className="text-muted-foreground text-sm opacity-60">
                        {isRTL ? 'وصلت لنهاية القائمة' : 'You have reached the end'}
                      </p>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
