import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { usePrompts, usePromptsCount } from "@/hooks/usePrompts";
import Header from "@/components/Header";
import PromptGrid from "@/components/PromptGrid";
import CategoryFilter from "@/components/CategoryFilter";
import FeaturedPrompts from "@/components/FeaturedPrompts";
import SEO from "@/components/Seo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

export default function Index() {
  const { isRTL } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePrompts(debouncedSearch, selectedCategory);

  const { data: totalCount } = usePromptsCount(debouncedSearch, selectedCategory);

  // Flatten all pages into a single array
  const prompts = useMemo(() => {
    return data?.pages.flat() || [];
  }, [data]);

  // Only show featured section when not searching/filtering
  const showFeatured = !searchQuery && selectedCategory === "all";

  return (
    <div className="min-h-screen bg-background relative">
      <SEO title={isRTL ? "الرئيسية" : "Home"} />

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {isRTL ? "اكتشف أفضل موجهات الذكاء الاصطناعي" : "Discover Top AI Prompts"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isRTL
              ? "مكتبة ضخمة للاستفادة من ChatGPT، Midjourney، والمزيد."
              : "A massive library to supercharge your ChatGPT, Midjourney, and more."}
          </p>

          <div className="relative max-w-lg mx-auto mt-6">
            <Search
              className={`absolute top-3.5 h-5 w-5 text-muted-foreground ${isRTL ? "right-3" : "left-3"
                }`}
            />
            <Input
              placeholder={
                isRTL
                  ? "ابحث عن موجه (مثال: تسويق، بايثون)..."
                  : "Search prompts (e.g., Marketing, Python)..."
              }
              className={`h-12 text-lg shadow-sm border-primary/20 focus-visible:ring-primary/50 ${isRTL ? "pr-10" : "pl-10"
                }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Featured Prompts Section - Only show when not searching */}
        {showFeatured && <FeaturedPrompts />}

        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 border-b border-border/40">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Section Title for All Prompts */}
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <h2 className="text-xl font-semibold text-foreground">
            {isRTL ? "جميع البرومبتات" : "All Prompts"}
          </h2>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              `(${totalCount ?? prompts.length})`
            )}
          </span>
        </div>

        <PromptGrid prompts={prompts} isLoading={isLoading} />

        {/* Load More Button */}
        {hasNextPage && (
          <div className="flex justify-center pt-8">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
              size="lg"
              className="min-w-[200px] gap-2"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isRTL ? "جارٍ التحميل..." : "Loading..."}
                </>
              ) : (
                isRTL ? "عرض المزيد" : "Load More"
              )}
            </Button>
          </div>
        )}

        {/* No more prompts message */}
        {!hasNextPage && prompts.length > 0 && !isLoading && (
          <p className="text-center text-muted-foreground py-4">
            {isRTL ? "لا يوجد المزيد من الموجهات" : "No more prompts to load"}
          </p>
        )}
      </main>
    </div>
  );
}
